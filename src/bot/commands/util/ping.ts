import { Message } from "discord.js";
import { Command } from "../../../lib";

export default class PingCommand extends Command {
  public constructor() {
    super("ping", {
      aliases: ["ping", "pong"],
      description: t => t("cmds:util.ping.desc"),
      typing: false
    });
  }

  public async exec(message: Message) {
    const start = Date.now();
    return new Promise(resolve => {
      // tslint:disable-next-line: no-string-literal
      (this.client["api"] as any).channels[message.channel.id].typing
        .post()
        .then(() => {
          resolve(
            message.sem(
              message.t("cmds:util.ping.res", {
                bot: this.client.ws.ping,
                api: Date.now() - start
              })
            )
          );
        });
    });
  }
}
