import { Message } from "discord.js";
import { Command, CommandOptions } from "klasa";
import { Init } from "../../../../lib";

@Init<CommandOptions>({ usage: "<content:...string>" })
export default class EightBallCommand extends Command {
  public async run(message: Message, [ c ]: [ string ]) {
    return message.reply(await this.client.apis.api("nekos").owoify(c));
  }
}
