import { Message } from "discord.js";
import { Command, Event } from "klasa";

export default class ArgumentErrorEvent extends Event {
  public run(message: Message, command: Command, params: any[], error: string) {
    const { name, usageString: usage } = command;
    return message
      .reply(
        [
          `
        **${name.capitalize()}**'s Usage: \`ky!${name} ${usage.replace(
            /:[\w.?]+/gi,
            ""
          )}\``,
          `- ${error}`,
        ].join("\n")
      )
      .catch((err) => this.client.logger.error(err));
  }
}
