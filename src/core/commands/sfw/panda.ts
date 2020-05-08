import { Message } from "discord.js";
import { Command, CommandOptions } from "klasa";
import { Init } from "../../../lib";

@Init<CommandOptions>({
  aliases: ["doggy"],
  description: (t) => t.get("sfw.panda"),
})
export default class CatCommand extends Command {
  public async run(message: Message) {
    const children = await this.client.apis.api("imgdit").imgur("panda"),
      image = children[Math.floor(Math.random() * children.length)];

    return message.sendMessage(
      this.client
        .embed(message)
        .setAuthor(image.author)
        .setURL(`https://imgur.com/${image.hash}`)
        .setTitle(image.title)
        .setImage(`https://imgur.com/${image.hash}${image.ext}`)
        .setFooter(`👀 ${image.views} ❤️ ${image.score}`)
    );
  }
}
