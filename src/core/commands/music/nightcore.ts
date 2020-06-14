import { GuildCommand } from "../../../lib";
import { Command } from "klasa";
import { Message } from "discord.js";

@GuildCommand()
export default class NightcoreCommand extends Command {
  public async run(message: Message) {
    if (!message.player) return message.reply(message.t("music.nope"));
    if (!message.inVc(message.guild.me))
      return message.reply(message.t("music.myvc"));

    await message.player.filter("timescale", { pitch: 1.15 }, true);

    return message.reply(message.t("music.nightcore.okay"));
  }
}
