import { Message } from "discord.js";
import { Command } from "klasa";
import { GuildCommand } from "../../../lib";

@GuildCommand({ usage: "[volume:int{0,100}]" })
export default class LeaveCommand extends Command {
  public async run(message: Message, [volume]: [number]) {
    if (!message.player) return message.reply(message.t("music.nope"));
    if (!volume) return message.reply(message.t("music.volume.cur", message));
    if (!message.inVc(message.guild.me))
      return message.reply(message.t("music.myvc"));

    await message.player.setVolume(volume);

    return message.reply(message.t("music.volume.set", volume));
  }
}
