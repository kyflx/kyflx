import { Message } from "discord.js";
import { Command } from "klasa";
import { DJCommand, Util } from "../../../lib";

@DJCommand({ usage: "<song:number>" })
export default class LeaveCommand extends Command {
  public async run(message: Message, [ i ]: [ number ]) {
    if (!message.player) return message.reply(message.t("music.nope"));
    if (!message.inVc(message.guild.me))
      return message.reply(message.t("music.myvc"));

    const song = message.queue.next[i - 1];
    if (!song) return message.reply(message.t("music.remove.invalid", i));

    message.queue.next.splice(i - 1, 1);
    return message.reply(message.t("music.remove.rm", Util.decodeSong(song)));
  }
}
