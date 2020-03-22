import { Message, TextChannel, User } from "discord.js";
import { Command } from "../../../lib";

export default class extends Command {
  public constructor() {
    super("impersonate", {
      aliases: ["impersonate"],
      args: [
        {
          id: "user",
          type: "user",
          prompt: {
            start: "Please provide a user to impersonate."
          }
        },
        {
          id: "content",
          match: "rest",
          prompt: {
            start: "Please provide some content to use."
          }
        }
      ],
      description: {
        content: "Impersonates a user.",
        usage: "<user> <content>",
        examples: ["v!impersonate Chaos I'm Gay!"]
      },
      ownerOnly: true
    });
  }

  public async exec(
    message: Message,
    { user, content }: { user: User; content: string }
  ) {
    if (message.deletable) await message.delete();
    if (message.channel.type !== "text") return message.sem(content);

    const hook = await message.channel.createWebhook(user.username, {
      avatar: user.displayAvatarURL(),
      reason: "Impersonation"
    });

    await hook.send(content);
    return hook.delete("Impersonation end.");
  }
}
