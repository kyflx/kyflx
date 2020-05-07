import { Message, GuildMember } from "discord.js";
import { Command, CommandOptions } from "klasa";
import { Init } from "../../../lib";

@Init<CommandOptions>({
  description: (t) => t.get("cmds.sfw.slap"),
  usage: "[target:member]",
})
export default class BakaCommand extends Command {
  public async run(message: Message, [target]: [GuildMember]) {
    const image = await this.client.apis.api("nekos").slap;
    if (!image) return message.reply("Sorry, I couldn't find anything.");
    
    return message.send(
      this.client
        .embed(message)
        .setDescription(`${message.member} slaps ${target ?? "me 🤬"}`)
        .setImage(image)
    );
  }
}
