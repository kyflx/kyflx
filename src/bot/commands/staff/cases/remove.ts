import { Command } from "../../../../lib";
import { Message } from "discord.js";

export default class CaseRemove extends Command {
  public constructor() {
    super("automod-remove", {
      category: "flag",
      args: [{}]
    });
  }

  public async exec(message: Message, {}: {}) {}
}
