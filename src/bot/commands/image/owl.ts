import { Command, get, VorteEmbed, ImgurHot } from "../../../lib";
import { Message } from "discord.js";

export default class extends Command {
  public constructor() {
    super("owl", {
      aliases: ["owl"],
      description: t => t("cmds:img.owl.desc")
    });
  }

  public async exec(message: Message) {
    const { data, error } = await get<ImgurHot>(
      "https://www.imgur.com/r/owl/hot.json"
    );
    if (!data) {
      this.logger.error(error);
      return message.sem(`Sorry, we ran into an error :(`, { type: "error" });
    }

    const image = data.data[Math.floor(Math.random() * data.data.length)];
    if (!image) return message.sem("cmds:img.owl.ohno", { t: true });
    return message.util.send(
      new VorteEmbed(message)
        .baseEmbed()
        .setAuthor(image.author)
        .setTitle(image.title)
        .setURL(`https://imgur.com/${image.hash}`)
        .setImage(`https://imgur.com/${image.hash}${image.ext}`)
        .setFooter(`👀 ${image.views} ❤️ ${image.score}`)
    );
  }
}
