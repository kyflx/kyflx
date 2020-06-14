import { Message } from "discord.js";
import { Command, Event } from "klasa";
import signale from "signale";

signale;

export default class CommandError extends Event {
  public run(message: Message, command: Command, _p: any[], error: Error) {
    if (error instanceof Error)
      this.client.logger.error({
        prefix: `command (${command})`,
        message: error,
      });

    message
      .reply(
        [
          `Oh no! I ran into an error, please report this at our [support server](https://discord.gg/BnQECNd)`,
          `\`\`\`js\n${error}\`\`\``,
        ].join("\n")
      )
      .catch((err) => this.client.logger.error(err));
  }
}
