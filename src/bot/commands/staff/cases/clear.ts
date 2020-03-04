import { Command } from "../../../../lib";
import { Message } from "discord.js";

export default class CaseClear extends Command {
  public constructor() {
    super("automod-clear", {
      category: "flag",
      args: [
        {
          id: "type",
          type: ["warn", "mute", "kick", "purge", "ban"]
        }
      ]
    });
  }

  public async exec(message: Message, { type }: { type: string }) {}
}
