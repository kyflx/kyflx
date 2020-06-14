import { Message } from "discord.js";
import { Command } from "klasa";
import { GuildCommand } from "../../../lib";

@GuildCommand({ usage: "[song|queue]" })
export default class LeaveCommand extends Command {
  public async run(message: Message, [ type = "song" ]: [ "song" | "queue" ]) {
    if (!message.player) return message.reply(message.t("music.nope"));
    if (!message.inVc(message.guild.me))
      return message.reply(message.t("music.myvc"));

    const v = (message.queue.repeat[type] = !message.queue.repeat[type]);
    return message.reply(message.t(`music.loop.done`, type, v));
  }
}
