import { Message } from "discord.js";
import { Command } from "klasa";
import { GuildCommand } from "../../../lib";

@GuildCommand()
export default class ResumeCommand extends Command {
  public async run(message: Message) {
    if (!message.player) return message.reply(message.t("music.nope"));
    if (!message.inVc(message.guild.me))
      return message.reply(message.t("music.myvc"));

    await message.player.resume();

    return message.reply(message.t("music.resume.res"));
  }
}
