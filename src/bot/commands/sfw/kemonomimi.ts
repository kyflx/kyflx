import { Message } from "discord.js";
import { Command, get, Nekos, SFW_LINKS, VorteEmbed } from "../../../lib";

export default class extends Command {
  public constructor() {
    super("kemonomimi", {
      aliases: ["kemonomimi"],
      description: t => t("cmds:sfw.kemo.desc")
    });
  }

  public async exec(message: Message) {
    const { data, error } = await get<Nekos>(SFW_LINKS.kemonomimi);
    if (!data) {
      this.logger.error(error);
      return message.sem(`Sorry, we ran into an error :(`, { type: "error" });
    }

    return message.util.send(new VorteEmbed(message).setImage(data.url));
  }
}
