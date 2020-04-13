/* Modules */
import Logger from "@ayanaware/logger";
import { decode } from "@lavalink/encoding";
import { AkairoClient, Flag, ListenerHandler } from "discord-akairo";
import { Message, Util } from "discord.js";
import { existsSync } from "fs";
import fetch from "node-fetch";
import { join } from "path";
import { LoadTrackResponse, Shoukaku } from "shoukaku";
import Database from "../bot/plugins/Database";
/* Custom Classes */
import { CommandHandler, Plugin, KyflxEmbed } from "./classes";
import {
  GuildProvider,
  GuildSettings,
  ProfileEntity,
  TagEntity,
} from "./database";
import { GameManager } from "./games";
import { LanguageProvider } from "./i18n";
import { Config, developers } from "./util";

export default class KyflxClient extends AkairoClient {
  public plugins: Map<string, Plugin> = new Map();
  public games: GameManager = new GameManager(this);
  public database = new Database(this);
  public _guilds: GuildProvider;

  public developers = developers;
  public maintenance: boolean = Config.get("maintenance_mode");

  public i18n: LanguageProvider = new LanguageProvider();
  public commands: CommandHandler;
  public events: ListenerHandler;

  public logger: Logger = Logger.get(KyflxClient);
  public music: Shoukaku = new Shoukaku(
    this,
    [
      {
        name: "main",
        auth: Config.get("lavalink_pass"),
        host: Config.getEnv("lavalink_host"),
        port: Config.get("lavalink_port"),
      },
    ],
    {}
  );

  public constructor(public directory: string) {
    super({
      ownerID: developers,
      disableMentions: "everyone",
      messageCacheMaxSize: 10000,
      fetchAllMembers: true,
      messageCacheLifetime: 432000,
      messageSweepInterval: 3600,
    });

    this.events = new ListenerHandler(this, {
      directory: join(directory, "events"),
      loadFilter: () => !this.maintenance,
    });

    this.commands = new CommandHandler(this, {
      directory: join(directory, "commands"),
      aliasReplacement: /-/g,
      automateCategories: true,
      prefix: async (message: Message) => {
        const prefix = Config.getEnv<string>("prefix");
        if (!message.guild) return prefix;
        return this._guilds.get<Array<string>>(message.guild.id, "prefixes", [
          prefix,
        ]);
      },
      defaultCooldown: 5000,
      handleEdits: true,
      commandUtil: true,
      allowMention: true,
      loadFilter: (f) => {
        if (this.maintenance) return false;
        const excluded = Config.getEnv<Array<string>>("load_filter").map((c) =>
          join(this.directory, "commands", c)
        );
        return excluded.length > 0
          ? !excluded.some((e) => f.includes(e))
          : true;
      },
      ignorePermissions: developers,
      ignoreCooldown: developers,
      argumentDefaults: {
        prompt: {
          modifyStart: (_: Message, p: string) =>
            new KyflxEmbed(_)
              .errorEmbed()
              .setDescription(p)
              .setFooter(_.t("def:prompt_cancel")),
          modifyRetry: (_: Message, p: string) =>
            new KyflxEmbed(_)
              .errorEmbed()
              .setDescription(p)
              .setFooter(_.t("def:prompt_cancel")),
          timeout: (_: Message) =>
            new KyflxEmbed(_)
              .errorEmbed()
              .setDescription(_.t("def:prompt_timeout")),
          ended: (_: Message) =>
            new KyflxEmbed(_)
              .errorEmbed()
              .setDescription(_.t("def:prompt_ended")),
          cancel: (_: Message) =>
            new KyflxEmbed(_)
              .errorEmbed()
              .setDescription(_.t("def:prompt_cancelled")),
          retry: (_: Message) => _.t("def:prompt_retry"),
          retries: 4,
          time: 30000,
        },
      },
    });

    this.commands.resolver.addType("tag", async (message, phrase) => {
      if (!message.guild) return Flag.fail(phrase);
      if (!phrase) return Flag.fail(phrase);

      phrase = Util.cleanContent(phrase.toLowerCase(), message);
      const tags = await TagEntity.find({
        where: {
          guildId: message.guild.id,
        },
      });

      const [tag] = tags.filter(
        (t) =>
          t.aliases.some((n) => n.toLowerCase() === phrase) ||
          t.name.toLowerCase() === phrase
      );
      return tag || Flag.fail(phrase);
    });
  }

  public async load(query: string): Promise<LoadTrackResponse> {
    return fetch(
      `http://${Config.getEnv("lavalink_host")}:${Config.get(
        "lavalink_port"
      )}/loadtracks?identifier=${query}`,
      {
        headers: {
          authorization: Config.get("lavalink_pass"),
        },
      }
    ).then((res) => res.json());
  }

  public decode = decode;

  public async login(token: string): Promise<string> {
    this.commands.useListenerHandler(this.events);
    this.events.setEmitters({
      client: this,
      commands: this.commands,
      events: this.events,
      process,
      music: this.music,
    });

    await this._loadPlugins();
    this.i18n.init(this);
    this.commands.loadAll();
    this.events.loadAll();

    this.once("ready", () => this.plugins.forEach(async (p) => p.onReady()));

    return super.login(token);
  }

  public ensureGuild(guildId: string): GuildSettings {
    let item = this._guilds.items.get(guildId);
    if (!item) item = this._guilds.create(guildId);
    return item;
  }

  public async ensureProfile(
    userId: string,
    guildId: string
  ): Promise<ProfileEntity> {
    return new Promise(async (resolve, reject) => {
      if (!this.database.ready) return reject();

      return ProfileEntity.findOne({
        where: {
          userId,
          guildId,
        },
      }).then((profile) => {
        if (profile) return resolve(profile);
        return resolve(ProfileEntity.create({ userId, guildId }));
      });
    });
  }

  private async _loadPlugins() {
    if (existsSync(join(this.directory, "plugins"))) {
      try {
        for (const file of CommandHandler.readdirRecursive(
          join(this.directory, "plugins")
        )) {
          try {
            // tslint:disable-next-line: tsr-detect-non-literal-require
            const mod = ((_) => _.default || _)(require(file));
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
