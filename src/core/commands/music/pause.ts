import { Message } from "discord.js";
import { Command, CommandOptions } from "klasa";
import { Init } from "../../../lib";

@Init<CommandOptions>({ runIn: ["text"] })
export default class PauseCommand extends Command {
  public async run(message: Message) {
    if (!message.player) return message.reply(message.t("music.nope"));
    await message.player.pause();
    return message.reply(message.t("music.pause.res"));
  }
}
