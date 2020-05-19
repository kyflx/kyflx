import { Message } from "discord.js";
import { Command } from "klasa";

export default class FactCommand extends Command {
  public async run(message: Message) {
    return message.reply(await this.client.apis.api("nekos").fact);
  }
}
