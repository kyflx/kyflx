import { Command, VorteMessage, VorteEmbed, get } from "@vortekore/lib";

export default class extends Command {
  public constructor() {
    super("lizard", {
      category: "Image",
      cooldown: 3000,
      description: "Provides a lizard pic from r/lizards",
      example: "!meme"
    });
  }

  public async run(message: VorteMessage) {
    const { data, error } = await get<RedditTopJSON.RootObject>(
      "https://www.reddit.com/r/lizards.json?limit=100"
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
