import { Command, VorteEmbed, get } from "@vortekore/lib";
import { Message } from "discord.js";

export default class extends Command {
  public constructor() {
    super("dog", {
      aliases: ["dog", "doggy"],
      description: t => t("cmds:img.dog.desc")
    });
  }

  public async exec(message: Message) {
    const { data, error } = await get<ImgurHot.RootObject>(
      "https://www.imgur.com/r/dog/hot.json"
    );
    if (!data) {
      this.logger.error(error);
      return message.sem(`Sorry, we ran into an error :(`, { type: "error" });
    }

    const image = data.data[Math.floor(Math.random() * data.data.length)];
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
