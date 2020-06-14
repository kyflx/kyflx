import { Message } from "discord.js";
import { Command, CommandOptions } from "klasa";
import { Init } from "../../../../lib";

@Init<CommandOptions>({ usage: "<content:...string>" })
export default class EightBallCommand extends Command {
  public async run(message: Message, [ c ]: [ string ]) {
    if (message.deletable) await message.delete();
    const str = c.split("").map(a => a === " " ? a : `||${a}||`);
    return message.reply(str.join(""));
  }
}
