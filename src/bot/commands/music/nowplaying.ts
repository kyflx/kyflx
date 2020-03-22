import { Message, MessageEmbed } from "discord.js";
import { Command, playerEmbed } from "../../../lib";

export default class extends Command {
  public constructor() {
    super("nowplaying", {
      aliases: ["nowplaying", "np"],
      description: t => t("cmds:music.np.desc"),
      channel: "guild"
    });
  }

  public async exec(message: Message) {
    if (!message.guild.me.voice.channel)
      return message.sem(message.t("cmds:music.no_vc"), { type: "error" });

    const current = message.queue.np;
    if (!current)
      return message.sem(message.t("cmds:music.np.empty"), {
        type: "error"
      });

    const np = this.client.decode(current.song),
      playingEmbed = new MessageEmbed()
        .setAuthor(np.author)
        .setColor(message._guild.embedColor)
        .setDescription(`[${np.title}](${np.uri})\n${playerEmbed(current)}`)
        .setThumbnail(`https://i.ytimg.com/vi/${np.identifier}/hqdefault.jpg`);
    return message.util.send(playingEmbed);
  }
}
