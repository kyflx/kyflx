import { Command, VorteEmbed } from "@vortekore/lib";
import { Message, User } from "discord.js";

export default class extends Command {
  public constructor() {
    super("avatar", {
      aliases: ["avatar", "ava", "av", "pfp"],
      description: {
        content: "Provides someones avatar",
        usage: "[user]",
        examples: ["v!av 396096412116320258", "v!av", "v!av @2D#5773"]
      },
      args: [
        {
          id: "user",
          type: "user",
          default: (message: Message) => message.author
        }
      ]
    });
  }

  public async exec(message: Message, { user }: { user: User }) {
    return message.util.send(
      new VorteEmbed(message).baseEmbed().setImage(user.displayAvatarURL({ size: 2048 }))
    );
  }
}