import { Message } from "discord.js";
import { Command, Event } from "klasa";
import { stripIndents } from "common-tags";

export default class ArgumentErrorEvent extends Event {
  public run(message: Message, command: Command, params: any[], error: string) {
    return message
      .reply(
        stripIndents`
        ${command.name.capitalize()}'s Usage: \`ky!${
          command.name
        } ${command.usageString.replace(/:[\w.?]+/gi, "")}\`
        - **${error}**
        `)
      .catch((err) => this.client.logger.error(err));
  }
}
