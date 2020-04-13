import { Message } from "discord.js";
import { Command, get, ImgurHot, SFW_LINKS, KyflxEmbed } from "../../../lib";

export default class extends Command {
  public constructor() {
    super("dog", {
      aliases: ["dog", "doggy"],
      description: t => t("cmds:sfw.dog.desc")
    });
  }

  public async exec(message: Message) {
    const { data, error } = await get<ImgurHot>(SFW_LINKS.dog);
    if (!data) {
      this.logger.error(error);
      return message.sem(`Sorry, we ran into an error :(`, { type: "error" });
    }

    const image = data.data[Math.floor(Math.random() * data.data.length)];
    return message.util.send(
      new KyflxEmbed(message)
        .setAuthor(image.author)
        .setTitle(image.title)
        .setURL(`https://imgur.com/${image.hash}`)
        .setImage(`https://imgur.com/${image.hash}${image.ext}`)
        .setFooter(`👀 ${image.views} ❤️ ${image.score}`)
    );
  }
}
