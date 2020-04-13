import { Message, TextChannel } from "discord.js";
// tslint:disable-next-line: no-implicit-dependencies
import fetch from "node-fetch";
import { Command, KyflxEmbed } from "../../../lib";

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
      return message.sem("Sorry this result was nfsw");

    link = `https://i.imgur.com/${link.hash}${link.ext}`;

    const emb = new KyflxEmbed(message).setImage(link);
    if (link.title) emb.setTitle(link.title);
    return message.util.send(emb);
  }
}
