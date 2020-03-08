import { decode } from "@lavalink/encoding";
import { Message } from "discord.js";
import { Command, playerEmbed, VorteEmbed } from "../../../lib";

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

    const np = decode(current.song),
      playingEmbed = new VorteEmbed(message)
        .setAuthor("Now Playing", message.author.displayAvatarURL())
        .setDescription(
          `**Song Name**: [${np.title}](${np.uri})\n**Author**: ${np.author}`
        )
        .addField(
          "\u200B",
          playerEmbed(message.queue, {
            np,
            position: current.position
          })
        );
    return message.util.send(playingEmbed);
  }
}
