import { Command, get, VorteEmbed, SubredditJson } from "../../../lib";
import { Message } from "discord.js";

export default class extends Command {
  public constructor() {
    super("meme", {
      aliases: ["meme", "joke"],
      description: t => t("cmds:img.meme.desc")
    });
  }

  public async exec(message: Message) {
    const { data, error } = await get<SubredditJson>(
      "https://www.reddit.com/r/dankmemes/top.json?limit=100"
    );
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
        .baseEmbed()
        .setAuthor(image.author)
        .setTitle(image.title)
        .setURL(`https://reddit.com${image.permalink}`)
        .setImage(image.url)
        .setFooter(`👍 ${image.ups}`)
    );
  }
}
