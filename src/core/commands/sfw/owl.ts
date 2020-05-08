import { Message } from "discord.js";
import { Command, CommandOptions } from "klasa";
import { Init } from "../../../lib";

@Init<CommandOptions>({ description: (t) => t.get("sfw.owl") })
export default class CatCommand extends Command {
  public async run(message: Message) {
    const children = await this.client.apis.api("imgdit").subreddit("owls"),
      images = children.filter((post) => post.data.post_hint === "image"),
      image = images[Math.floor(Math.random() * images.length)].data;

    return message.sendMessage(
      this.client
        .embed(message)
        .setAuthor(image.author)
        .setURL(`https://reddit.com${image.permalink}`)
        .setTitle(image.title)
        .setImage(image.url)
        .setFooter(`👍 ${image.ups}`)
    );
  }
}
