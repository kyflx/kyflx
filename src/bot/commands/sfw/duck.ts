import { Command, get, VorteEmbed, Reddit, SFW_LINKS } from "../../../lib";
import { Message } from "discord.js";

export default class extends Command {
  public constructor() {
    super("duck", {
      aliases: ["duck", "ducky"],
      description: t => t("cmds:sfw.duck.desc")
    });
  }

  public async exec(message: Message) {
    const { data, error } = await get<Reddit>(SFW_LINKS.duck);
    if (!data) {
      this.logger.error(error);
      return message.sem(`Sorry, we ran into an error :(`, { type: "error" });
    }

    const images = data.data.children.filter(
        post => post.data.post_hint === "image"
      ),
      image = images[Math.floor(Math.random() * images.length)].data;
    return message.util.send(
      new VorteEmbed(message)
        .setAuthor(image.author)
        .setTitle(image.title)
        .setURL(`https://reddit.com${image.permalink}`)
        .setImage(image.url)
        .setFooter(`👍 ${image.ups}`)
    );
  }
}
