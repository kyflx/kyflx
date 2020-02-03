import { Command, VorteEmbed } from "@vortekore/lib";
import { playerEmbed } from "../../util";
import { Message, Util } from "discord.js";

export default class extends Command {
  public constructor() {
    super("nowplaying", {
      aliases: ["nowplaying", "np"],
      description: {
        content: "Sends the current playing song."
      },
      channel: "guild"
    });
  }

  public async exec(message: Message) {
    if (!message.guild.me.voice.channel)
      return message.sem("I'm not in a voice channel...", { type: "error" });

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

    const current = await message.queue.current();

    if (!current)
      return message.sem(`Sorry, there is nothing playing :p`, {
        type: "error"
      });

    let np = await this.client.music.decode(current.track);
    let playingEmbed = new VorteEmbed(message)
      .musicEmbed()
      .setAuthor("Now Playing", message.author.displayAvatarURL())
      .setDescription(
        `**Song Name**: [${Util.escapeMarkdown(np.title)}](${np.uri})\n**Author**: ${np.author}`
      )
      .addField(
        "\u200B",
        playerEmbed(message.queue, {
          ...current,
          np: { info: np, track: current.track }
        })
      );
    return message.util.send(playingEmbed);
  }
}
