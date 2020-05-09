import { Message } from "discord.js";
import { Command, CommandOptions } from "klasa";
import { Init } from "../../../lib";

@Init<CommandOptions>({ description: (t) => t.get("music.np.desc") })
export default class LeaveCommand extends Command {
  public async run(message: Message) {
    return message.reply("lol");
  }
}
