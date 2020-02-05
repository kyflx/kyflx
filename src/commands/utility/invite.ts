import { Command } from "@vortekore/lib";
import { Message } from "discord.js";

export default class extends Command {
  public constructor() {
    super("invite", {
      aliases: ["invite"],
      description: {
        content: "Sends a bot invite."
      }
    });
  }

  public async exec(message: Message) {
    return message.sem(
      `Use [this link](${await this.client.generateInvite(
        8
      )}) to invite the bot!`
    );
  }
}
