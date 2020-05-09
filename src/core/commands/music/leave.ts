import { Message } from "discord.js";
import { Command, CommandOptions } from "klasa";
import { Init } from "../../../lib";

@Init<CommandOptions>({ description: (t) => t.get("music.leave.desc"), })
export default class LeaveCommand extends Command {
  public async run(message: Message) {
    if (!message.player) return message.reply(message.t("music.nope"));


    return message.reply(message.t("music.pause.res"));
  }
}
