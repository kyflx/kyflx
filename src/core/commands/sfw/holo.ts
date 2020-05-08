import { Message } from "discord.js";
import { Command, CommandOptions } from "klasa";
import { Init } from "../../../lib";

@Init<CommandOptions>({ description: (t) => t.get("sfw.holo") })
export default class BakaCommand extends Command {
  public async run(message: Message) {
    const image = await this.client.apis.api("nekos").holo;
    if (!image) return message.reply("Sorry, I couldn't find anything.");
    return message.send(this.client.embed(message).setImage(image));
  }
}
