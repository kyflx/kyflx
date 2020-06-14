import { Message } from "discord.js";
import { Command } from "klasa";
import { GuildCommand, Util } from "../../../lib";

@GuildCommand({ aliases: [ "nowplaying" ] })
export default class LeaveCommand extends Command {
  public async run(message: Message) {
    if (!message.player) return message.reply(message.t("music.nope"));
    if (!message.queue.np.song) return message.reply(message.t("music.np.not"));

    const _ = Util.decodeSong(message.queue.np.song);
    return message.send(
      this.client
        .embed(message)
        .setAuthor(_.author)
        .setColor(_.extra.color)
        .setDescription(`**[${_.title}](${_.url})**\n${Util.playerEmbed(message)}`)
        .setThumbnail(_.artwork)
    );
  }
}
