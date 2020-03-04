import { Command } from "../../../../lib";
import { Message } from "discord.js";

export default class CaseView extends Command {
  public constructor() {
    super("automod-view", {
      category: "flag",
      args: [{}]
    });
  }

  public async exec(message: Message, {}: {}) {}
}
