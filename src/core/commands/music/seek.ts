import { Message } from "discord.js";
import { Command } from "klasa";
import { GuildCommand, Util } from "../../../lib";

@GuildCommand({ usage: "<position:ms>" })
export default class LeaveCommand extends Command {
  public async run(message: Message, [position]: [number]) {
    if (!message.player) return message.reply(message.t("music.nope"));
    if (!message.inVc(message.guild.me))
      return message.reply(message.t("music.myvc"));
    if (!message.queue.np.song) return message.reply(message.t("music.np.not"));

    const _ = Util.decodeSong(message.queue.np.song);
    if (position > _.length) position = position - (~(_.length - position) + 1);

    await message.player.seek(position - 500);
    return message.reply(message.t("music.seek.res", position - 500));
  }
}
