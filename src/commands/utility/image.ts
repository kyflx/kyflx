import { Command, VorteEmbed } from "@vortekore/lib";
import { TextChannel, Message } from "discord.js";
import fetch from "node-fetch";

export default class extends Command {
  public constructor() {
    super("image", {
      aliases: ["image"],
      description: t => t("cmds:util.img.desc"),
      args: [
        {
          id: "image",
          prompt: {
            start: "Please provide a search query."
          },
          match: "rest"
        }
      ]
    });
  }

  public async exec(message: Message, { image }: { image: string }) {
    let link: any = `https://imgur.com/r/${image}/hot.json`;
    const { data } = await fetch(link).then(res => res.json());
    link = data[Math.floor(Math.random() * data.length)];
    if ((message.channel as TextChannel).nsfw && link.nsfw)
      return message.reply("Sorry this result was NSFW");

    link = `https://i.imgur.com/${link.hash}${link.ext}`;

    while (!link) data[Math.floor(Math.random() * data.length)];

    const emb = new VorteEmbed(message)
      .baseEmbed()
      .setColor("#000000")
      .setImage(link);
    if (link.title) emb.setTitle(link.title);
    message.util.send(emb);
  }
}
