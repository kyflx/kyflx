import { Message } from "discord.js";
import { Command, get, Reddit, SFW_LINKS, KyflxEmbed } from "../../../lib";

export default class extends Command {
  public constructor() {
    super("lizard", {
      aliases: ["lizard"],
      description: t => t("cmds:sfw.lizard.desc")
    });
  }

  public async exec(message: Message) {
    const { data, error } = await get<Reddit>(SFW_LINKS.lizard);
    if (!data) {
      this.logger.error(error);
      return message.sem(`Sorry, we ran into an error :(`, { type: "error" });
    }

    const images = data.data.children.filter(
        post => post.data.post_hint === "image"
      ),
      image = images[Math.floor(Math.random() * images.length)].data;
    return message.util.send(
      new KyflxEmbed(message)
        .setAuthor(image.author)
        .setTitle(image.title)
        .setURL(`https://reddit.com${image.permalink}`)
        .setImage(image.url)
        .setFooter(`👍 ${image.ups}`)
    );
  }
}
