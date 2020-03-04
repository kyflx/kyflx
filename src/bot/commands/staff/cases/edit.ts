import { Command } from "../../../../lib";
import { Message } from "discord.js";

export default class CaseEdit extends Command {
  public constructor() {
    super("automod-edit", {
      category: "flag",
      args: [{}]
    });
  }

  public async exec(message: Message, {}: {}) {}
}
