import { Message } from "discord.js";
import { Command, CommandOptions } from "klasa";
import { Init } from "../../../../lib";

@Init<CommandOptions>({ usage: "<question:...string>" })
export default class EightBallCommand extends Command {
  public async run(message: Message, [ q ]: [ string ]) {
    const { url } = await this.client.apis.api("nekos")["8ball"];
    return message.send(
      this.client.embed(message).setDescription(`*${q}*`).setImage(url)
    );
  }
}
