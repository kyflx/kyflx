import { Message } from "discord.js";
import { Command, get, Reddit, SFW_LINKS, VorteEmbed } from "../../../lib";

export default class extends Command {
  public constructor() {
    super("owl", {
      aliases: ["owl"],
      description: t => t("cmds:sfw.owl.desc")
    });
  }

  public async exec(message: Message) {
    const { data, error } = await get<Reddit>(SFW_LINKS.owl);
    if (!data || error) {
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
