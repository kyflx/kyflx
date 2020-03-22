import Logger from "@ayanaware/logger";
import {
  Command as AkarioCommand,
  CommandHandler as CMDHandler,
  CommandOptions,
  Listener as AkairoListener
} from "discord-akairo";
import { Guild, Message, Snowflake } from "discord.js";
import { InsertResult, UpdateResult } from "typeorm";
import { GuildEntityChannels, GuildLogsMap } from "..";
import VorteClient from "../Client";
import { GuildSettings } from "../database";

export type Translatable<T extends any> = (
  translate: (path: string, i?: Record<string, any>) => any
) => T;

export interface CommandDescription {
  content?: string | Translatable<string>;
  usage?: string;
  examples?: Array<string>;
}

interface ExtendedOptions extends CommandOptions {
  description?: CommandDescription | Translatable<CommandDescription>;
}

export class Command extends AkarioCommand {
  public logger: Logger = Logger.get(Command);
  public client: VorteClient;

  public constructor(id: string, options: ExtendedOptions = {}) {
    super(id, options);
  }

  public async updateDb(
    guild: string | Guild,
    key: string,
    value: any
  ): Promise<UpdateResult> {
    return this.client._guilds.set(guild, key, value);
  }

  public log(
    settings: GuildSettings,
    log: keyof GuildLogsMap,
    chan: keyof GuildEntityChannels
  ): { channel: Snowflake; enabled: boolean } {
    const channel = settings.channels[chan];
    const enabled = !!settings.logs[log];
    return { channel, enabled };
  }
}

export class Listener extends AkairoListener {
  public logger: Logger = Logger.get(Listener);
}

export class CommandHandler extends CMDHandler {
  public async handle(message: Message) {
    if (message.guild) {
      if (!this.client.database.ready) return;
      try {
        message._guild = this.client.ensureGuild(message.guild.id);
        message.profile = await this.client.ensureProfile(
          message.author.id,
          message.guild.id
        );
      } catch (error) {
        return;
      }
    }

    return super.handle(message);
  }
}
