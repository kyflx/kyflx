import { Message } from "discord.js";
import { Command, get, Nekos, SFW_LINKS, KyflxEmbed } from "../../../lib";

export default class extends Command {
  public constructor() {
    super("smug", {
      aliases: ["smug"],
      description: t => t("cmds:sfw.neko.smug")
    });
  }

  public async exec(message: Message) {
    const { data, error } = await get<Nekos>(SFW_LINKS.smug);
    if (!data) {
      this.logger.error(error);
      return message.sem(`Sorry, we ran into an error :(`, { type: "error" });
    }

    return message.util.send(new KyflxEmbed(message).setImage(data.url));
  }
}
