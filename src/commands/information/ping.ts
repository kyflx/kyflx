import { Command } from "@vortekore/lib";
import Verta from "../../plugins/Music";
import { Message } from "discord.js";

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
    const music = <Verta>this.client.plugins.get("music");
    await music.getStats();

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
                `**Verta Ping**: ${Math.round(music.ping)}ms`
              ].join("\n")
            )
          );
        });
    });
  }
}
