import { Command, VorteMessage, VorteEmbed, get } from "@vortekore/lib";

export default class extends Command {
  public constructor() {
    super("wolf", {
      category: "Image",
      aliases: ["wolves"],
      cooldown: 3000,
      description: "Provides a picture of a wolf from r/wolves",
      example: "!meme"
    });
  }

  public async run(message: VorteMessage) {
    const { data, error } = await get<RedditTopJSON.RootObject>(
      "https://www.reddit.com/r/wolves.json?limit=100"
    );
    if (!data) {
      this.logger.error(error);
      return message.sem(`Sorry, we ran into an error :(`, { type: "error" });
    }

    const images = data.data.children.filter(
        post => post.data.post_hint === "image"
      ),
      image = images[Math.floor(Math.random() * images.length)].data;
    return message.channel.send(
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
