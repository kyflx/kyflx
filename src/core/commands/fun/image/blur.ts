import { Message } from "discord.js";
import { Command, CommandOptions } from "klasa";
import { Init } from "../../../../lib";

const IMAGE_REGEX = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/;

@Init<CommandOptions>({ description: (t) => t.get("sfw.meme") })
export default class CatCommand extends Command {
  public async run(message: Message) {
    return message.send("[WIP]");
  }
}
