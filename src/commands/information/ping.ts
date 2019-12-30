import { Command, VorteMessage } from "@vortekore/lib";
import Communicator from "../../plugins/Music";

export default class extends Command {
  public constructor() {
    super("ping", {
      aliases: ["pong"],
      description: "Sends the bot & discord api ping.",
      category: "Information"
    });
  }

  public async run(message: VorteMessage) {
    const music = <Communicator> this.bot.plugins.get("music")
    await music.getPing();

    const start = Date.now();
    return new Promise(resolve => {
      (<any>this.bot["api"]).channels[message.channel.id].typing
        .post()
        .then(() => {
          return resolve(
            message.sem(
              [
                `**Bot Ping**: ${Math.round(this.bot.ws.ping)}ms`,
                `**API Ping**: ${Math.round(Date.now() - start)}ms`,
                `**Verta Ping**: ${Math.round(music.ping)}ms`
              ].join("\n")
            )
          );
        });
    });
  }
}
