import { Message } from "discord.js";
import { Command, CommandOptions } from "klasa";
import { Init } from "../../../../lib";
import { URLSearchParams } from "url";

@Init<CommandOptions>({ usage: "<query:...string>" })
export default class EightBallCommand extends Command {
  public async run(message: Message, [ q ]: [ string ]) {
    return message.reply(`https://lmgtfy.com/?${new URLSearchParams({ q })}`);
  }
}
