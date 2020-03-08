import { Message } from "discord.js";
import { Nekos, VorteEmbed, get, Command, SFW_LINKS } from "../../../lib";

export default class extends Command {
  public constructor() {
    super("neko", {
      aliases: ["neko"],
      description: t => t("cmds:sfw.neko.desc")
    });
  }

  public async exec(message: Message) {
    const { data, error } = await get<Nekos>(
      Math.random() > 0.5 ? SFW_LINKS.neko : SFW_LINKS.nekoGif
    );
    if (!data) {
      this.logger.error(error);
      return message.sem(`Sorry, we ran into an error :(`, { type: "error" });
    }

    return message.util.send(new VorteEmbed(message).setImage(data.url));
  }
}
