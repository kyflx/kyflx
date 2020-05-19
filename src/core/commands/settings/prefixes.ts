import { GuildCommand } from "../../../lib";
import { Command } from "klasa";
import { Message } from "discord.js";

@GuildCommand({
  usage: "<add|remove|show:default> [prefix:string{,5}]",
  subcommands: true,
  usageDelim: " ",
  permissionLevel: 5,
  extendedHelp: (t) => t.get("settings.prefix.ext-help"),
})
export default class PrefixesCommand extends Command {
  public async show(message: Message) {
    return message.reply(
      message.t("settings.prefixes.cur", message.guildSettings.get("prefix"))
    );
  }

  public async add(message: Message, prefix: [string]) {
    if (message.guild.settings.get("prefix").length >= 10)
      return message.reply(message.t("settings.prefixes.max"));

    if (!prefix[0]) return message.reply(message.t("settings.prefixes.giv"));

    await message.guildSettings.update("prefix", prefix[0]);
    return message.reply(message.t(`settings.prefixes.add`, prefix[0]));
  }

  public async remove(message: Message, prefix: [string]) {
    if (!message.guild.settings.get("prefix").includes(prefix[0]))
      return message.reply(message.t("settings.prefixes.!exists", prefix[0]));

    if (!prefix[0]) return message.reply(message.t("settings.prefixes.giv"));

    await message.guildSettings.update("prefix", prefix[0]);
    return message.reply(message.t(`settings.prefixes.remove`, prefix[0]));
  }
}
