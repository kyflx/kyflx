import { Message, GuildMember } from "discord.js";
import { Command, CommandOptions } from "klasa";
import { Init } from "../../../lib";

@Init<CommandOptions>({
  description: (t) => t.get("cmds.sfw.pat"),
  usage: "[target:member]",
})
export default class BakaCommand extends Command {
  public async run(message: Message, [target]: [GuildMember]) {
    const image = await this.client.apis.api("nekos").pat;
    if (!image) return message.reply("Sorry, I couldn't find anything.");
    
    return message.send(
      this.client
        .embed(message)
        .setDescription(`${message.member} pats ${target ?? "me 🙂"}`)
        .setImage(image)
    );
  }
}
