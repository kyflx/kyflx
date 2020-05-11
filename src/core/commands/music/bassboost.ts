import { Message } from "discord.js";
import { Command } from "klasa";
import { GuildCommand, Util } from "../../../lib";

@GuildCommand({
  usage: "[earrape|extreme|hard|soft|off]",
  usageDelim: "|",
  extendedHelp: (t) => t.get("music.bassboost.ext-help"),
  aliases: ["bb"],
})
export default class BassboostCommand extends Command {
  public async run(
    message: Message,
    [level]: ["earrape" | "extreme" | "hard" | "soft" | "off"]
  ) {
    if (!message.player) return message.reply(message.t("music.nope"));
    if (!level) return message.reply(message.t("music.bassboost.cur", message));
    if (!message.inVc(message.guild.me))
      return message.reply(message.t("music.myvc"));

    const set = (...bands: Array<number>) =>
      message.player.equalizer.bind(message.player, Util.ArrToBands(bands));
    await when(level, {
      earrape: set(1, 0.75),
      extreme: set(0.75, 0.5),
      hard: set(0.5, 0.25),
      soft: set(0.25, 0.15),
      off: set(0, 0),
    });

    message.player.bass = level;

    return message.reply(message.t("music.bassboost.res", level));
  }
}
