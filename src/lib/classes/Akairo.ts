import Logger from "@ayanaware/logger";
import {
  Command as AkarioCommand,
  CommandHandler as CMDHandler,
  CommandOptions,
  Listener as AkairoListener
} from "discord-akairo";
import { Message } from "discord.js";
import VorteClient from "../Client";

export type Translatable<T extends any> = (
  translate: (path: string, i?: Record<string, any>) => any
) => T;

export type CommandDescription = {
  content?: string | Translatable<string>;
  usage?: string;
  examples?: string[];
};

interface ExtendedOptions extends CommandOptions {
  description?: CommandDescription | Translatable<CommandDescription>;
}

export class Command extends AkarioCommand {
  public logger: Logger = Logger.get(Command);
  public client: VorteClient;

  public constructor(id: string, options: ExtendedOptions = {}) {
    super(id, options);
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
        message._guild = this.client.findOrCreateGuild(message.guild.id);
        message.profile = await this.client.findOrCreateProfile(
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
