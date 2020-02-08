import { Command, VorteEmbed } from "@vortekore/lib";
import { playerEmbed } from "../../util";
import { Message, Util } from "discord.js";

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

    if (message.player.radio) {
      const stationEmbed = new VorteEmbed(message)
        .musicEmbed()
        .setAuthor("VorteKore 420.69 FM", message.author.displayAvatarURL())
        .setDescription(
          [
            `**Station**: ${message.player.radio.name}`,
            `**Country**: ${message.player.radio.country}`,
            `**Clicks**: ${message.player.radio.clickcount.toLocaleString()}`,
            `**Homepage**: ${message.player.radio.homepage}`
          ].join("\n")
        );
      if (message.player.radio.favicon)
        stationEmbed.setThumbnail(message.player.radio.favicon);
      return message.util.send(stationEmbed);
    }

    const current = message.queue.np;
    if (!current)
      return message.sem(message.t("cmds:music.np.empty"), {
        type: "error"
      });

    let np = await this.client.music.decode(current.song);
    let playingEmbed = new VorteEmbed(message)
      .musicEmbed()
      .setAuthor("Now Playing", message.author.displayAvatarURL())
      .setDescription(
        `**Song Name**: [${Util.escapeMarkdown(np.title)}](${
          np.uri
        })\n**Author**: ${np.author}`
      )
      .addField(
        "\u200B",
        playerEmbed(message.queue, {
          ...current,
          np: { info: np, track: current.song }
        })
      );
    return message.util.send(playingEmbed);
  }
}
