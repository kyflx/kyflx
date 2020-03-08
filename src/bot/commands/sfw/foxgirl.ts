import { Message } from "discord.js";
import { Nekos, VorteEmbed, get, Command, SFW_LINKS } from "../../../lib";

export default class extends Command {
  public constructor() {
    super("fox-girl", {
      aliases: ["fox-girl"],
      description: t => t("cmds:sfw.foxg.desc")
    });
  }

  public async exec(message: Message) {
    const { data, error } = await get<Nekos>(SFW_LINKS.foxGirl);
    if (!data) {
      this.logger.error(error);
      return message.sem(`Sorry, we ran into an error :(`, { type: "error" });
    }

    return message.util.send(new VorteEmbed(message).setImage(data.url));
  }
}
