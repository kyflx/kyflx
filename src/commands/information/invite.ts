import { Command } from "@vortekore/lib";
import { Message } from "discord.js";

export default class extends Command {
  constructor() {
    super("invite", {
      aliases: ["invite"],
      description: {
        content: "Sends a bot invite."
      }
    });
  }

  async exec(message: Message) {
    return message.sem("Use [this link](http://bit.ly/2EmfskO) to invite the bot!");
  }
}
