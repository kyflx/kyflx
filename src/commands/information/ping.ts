import { Command } from "@vortekore/lib";
import { Message } from "discord.js";
import { VERTA_DEPENDENT } from '../../index';

export default class extends Command {
  public constructor() {
    super("ping", {
      aliases: ["ping", "pong"],
      description: {
        content: "Sends the bot & discord api ping."
      }
    });
  }

  public async exec(message: Message) {
    if (VERTA_DEPENDENT) await this.client.music.getStats();

    const start = Date.now();
    return new Promise(resolve => {
      (<any>this.client["api"]).channels[message.channel.id].typing
        .post()
        .then(() => {
          return resolve(
            message.sem(
              [
                `**Bot Ping**: ${Math.round(this.client.ws.ping)}ms`,
                `**API Ping**: ${Math.round(Date.now() - start)}ms`,
                VERTA_DEPENDENT
                  ? `**Verta Ping**: ${Math.round(this.client.music.ping)}ms`
                  : ""
              ].join("\n")
            )
          );
        });
    });
  }
}
