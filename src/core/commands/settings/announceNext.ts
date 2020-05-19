import { Message } from "discord.js";
import { Command } from "klasa";
import { GuildCommand } from "../../../lib";

@GuildCommand({
  description: (t) => t.get("settings.an.desc"),
  usage: "[toggle]",
})
export default class ToggleAnnounceNextCommand extends Command {
  public async run(message: Message, [toggle]: [string]) {
    const toggled = message.guildSettings.get("announceNext");
    if (!toggle) return message.reply(message.t("settings.an.cur", toggled));
    await message.guildSettings.update("announceNext", !toggled);
    return message.reply(message.t("settings.an.toggled", !toggled));
  }
}
