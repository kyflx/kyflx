import { Event } from "klasa";
import { Message } from "discord.js";
import { stripIndents } from "common-tags";
import { Command } from "klasa";
import signale from "signale";

signale

export default class CommandError extends Event {
  public run(message: Message, command: Command, _p: any[], error: Error) {
    if (error instanceof Error)
      this.client.logger.error({
        prefix: `command (${command})`,
        message: error,
      });

    message
      .reply(stripIndents`
      Oh no! I ran into an error, please report this at our [support server](https://discord.gg/BnQECNd)
      \`\`\`js\n${error}\`\`\`
      `).catch((err) => this.client.logger.error(err));
  }
}
