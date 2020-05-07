import { Message } from "discord.js";
import { Command, CommandOptions } from "klasa";
import { Init } from "../../../lib";

@Init<CommandOptions>({ runIn: ["text"] })
export default class ResumeCommand extends Command {
  public async run(message: Message) {
    if (!message.player) return message.reply(message.t("music.nope"));
    await message.player.resume();
    return message.reply(message.t("music.resume.res"));
  }
}
