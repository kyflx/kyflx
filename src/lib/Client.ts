/* Modules */
import Logger from "@ayanaware/logger";
import { AkairoClient, Flag, ListenerHandler } from "discord-akairo";
import { Message, Util } from "discord.js";
import { existsSync } from "fs";
import Node, { Player } from "lavalink";
import { join } from "path";

/* Custom Classes */
import { Plugin, CommandHandler, Queue, VorteEmbed, GameManager } from "./classes";
import { GuildEntity, ProfileEntity, TagEntity } from "./database";
import { LanguageProvider } from "./i18n";
import { Config, ConfigData, developers } from "./util";
import Database from "../bot/plugins/Database";

declare module "discord.js" {
  interface Message {
    client: VorteClient;
    _guild: GuildEntity;
    profile: ProfileEntity;
    player: Player;
    queue: Queue;

    sem(
      content: string,
      options?: { type?: "normal" | "error"; t?: boolean; _new?: boolean },
      i?: Record<string, any>
    ): Promise<Message>;

    t<T extends any>(key: string, i?: Record<string, any>): T;
  }
}

declare module "discord-akairo" {
  interface AkairoClient {
    plugins: Map<string, Plugin>;
    games: GameManager;
    commands: CommandHandler;
    events: ListenerHandler;
    config: Config<ConfigData>;
    music: Node;

    logger: Logger;
    database: Database;

    maintenance: boolean;
    developers: string[];
    directory: string;

    findOrCreateGuild(guildId: string): GuildEntity;

    findOrCreateProfile(
      userId: string,
      guildId: string
    ): Promise<ProfileEntity>;
  }
}

declare module "lavalink" {
  interface Player {
    bass: "high" | "medium" | "low" | "none";
    queue: Queue;
    volume: number;
  }
}

export default class VorteClient extends AkairoClient {
  public plugins: Map<string, Plugin> = new Map();
  public games: GameManager = new GameManager(this);
  public database = new Database(this);

  public developers = developers;
  public config: Config<ConfigData> = new Config();
  public maintenance: boolean = this.config.get("MAINTENANCE");

  public i18n: LanguageProvider = new LanguageProvider();
  public commands: CommandHandler;
  public events: ListenerHandler;

  public logger: Logger = Logger.get(VorteClient);
  public music: Node = new Node({
    password: this.config.get("NODE_AUTH"),
    host: this.config.get("NODE_HOST"),
    userID: this.config.get("USER_ID"),
    send: (guildId: string, packet) => {
      const guild = this.guilds.resolve(guildId);
      if (guild) guild.shard.send(packet);
      return;
    }
  });

  public constructor(public directory: string) {
    super({
      ownerID: developers,
      disableMentions: "everyone",
      messageCacheMaxSize: 10000,
      fetchAllMembers: true,
      messageCacheLifetime: 432000,
      messageSweepInterval: 3600
    });

    this.events = new ListenerHandler(this, {
      directory: join(directory, "events"),
      loadFilter: () => !this.maintenance
    });

    this.commands = new CommandHandler(this, {
      directory: join(directory, "commands"),
      aliasReplacement: /-/g,
      automateCategories: true,
      prefix: async (message: Message) => {
        if (!message.guild) return this.config.get("DEFAULT_PREFIX");
        return this.database.guilds.get(message.guild.id, "prefixes", ["v!"]);
      },
      defaultCooldown: 5000,
      handleEdits: true,
      commandUtil: true,
      allowMention: true,
      loadFilter: f => {
        if (this.maintenance) return false;
        let excluded = this.config.get("EXCLUDED_COMMANDS").map(c => join(this.directory, "commands", c));
        return excluded.length > 0 ? !excluded.some(e => f.includes(e)) : true;
      },
      argumentDefaults: {
        prompt: {
          modifyStart: (_: Message, p: string) =>
            new VorteEmbed(_)
              .errorEmbed()
              .setDescription(p)
              .setFooter(_.t("def:prompt_cancel")),
          modifyRetry: (_: Message, p: string) =>
            new VorteEmbed(_)
              .errorEmbed()
              .setDescription(p)
              .setFooter(_.t("def:prompt_cancel")),
          timeout: (_: Message) =>
            new VorteEmbed(_)
              .errorEmbed()
              .setDescription(_.t("def:prompt_timeout")),
          ended: (_: Message) =>
            new VorteEmbed(_)
              .errorEmbed()
              .setDescription(_.t("def:prompt_ended")),
          cancel: (_: Message) =>
            new VorteEmbed(_)
              .errorEmbed()
              .setDescription(_.t("def:prompt_cancelled")),
          retry: (_: Message) => _.t("def:prompt_retry"),
          retries: 4,
          time: 30000
        }
      }
    });

    this.commands.resolver.addType("tag", async (message, phrase) => {
      if (!message.guild) return Flag.fail(phrase);
      if (!phrase) return Flag.fail(phrase);

      phrase = Util.cleanContent(phrase.toLowerCase(), message);
      const tags = await TagEntity.find({
        where: {
          guildId: message.guild.id
        }
      });

      const [tag] = tags.filter(
        tag =>
          tag.aliases.some(n => n.toLowerCase() === phrase) ||
          tag.name.toLowerCase() === phrase
      );
      return tag || Flag.fail(phrase);
    });

    this.ws.on("VOICE_SERVER_UPDATE", _ => this.music.voiceServerUpdate(_));
    this.ws.on("VOICE_STATE_UPDATE", _ => this.music.voiceStateUpdate(_));
  }

  public async login(token: string): Promise<string> {
    this.commands.useListenerHandler(this.events);
    this.events.setEmitters({
      client: this,
      commands: this.commands,
      events: this.events,
      process,
      music: this.music
    });

    this._loadPlugins();
    this.i18n.init(this);
    this.commands.loadAll();
    this.events.loadAll();

    this.once("ready", () => this.plugins.forEach(p => p.onReady()));

    return super.login(token);
  }

  public findOrCreateGuild(guildId: string): GuildEntity {
    let item = this.database.guilds.items.get(guildId);
    if (!item) {
      item = GuildEntity.create({ guildId });
      this.database.guilds.items.set(guildId, item);
    }
    return item;
  }

  public findOrCreateProfile(
    userId: string,
    guildId: string
  ): Promise<ProfileEntity> {
    return new Promise(async (resolve, reject) => {
      if (!this.database.ready) return reject();
      return ProfileEntity.findOne({ where: { userId, guildId } }).then(
        profile => {
          if (profile) return resolve(profile);
          return resolve(ProfileEntity.create({ userId, guildId }));
        }
      );
    });
  }

  private async _loadPlugins() {
    if (existsSync(join(this.directory, "plugins"))) {
      try {
        for (const file of CommandHandler.readdirRecursive(
          join(this.directory, "plugins")
        )) {
          try {
            const mod = (_ => _.default || _)(require(file));
            if (!mod) return;

            const plugin = new mod(this);
            await plugin.onLoad();

            this.plugins.set(plugin.name, plugin);
            Object.defineProperty(this, plugin.name, { value: plugin });
          } catch (error) {
            this.logger.info(error);
          }
        }
      } catch (error) {
        this.logger.error(error);
      }
    }
  }
}
