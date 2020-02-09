import { Command } from "@vortekore/lib";
import { Message } from "discord.js";
import { TextChannel } from "discord.js";
import { User } from "discord.js";

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
        examples: [ "v!impersonate Chaos I'm Gay!" ]
      },
      ownerOnly: true
    });
  }

  public async exec(
    message: Message,
    { user, content }: { user: User; content: string }
  ) {
    if (message.deletable) message.delete();
    if (message.channel.type !== "text") return message.sem(content);
    
    const hook = await (<TextChannel>message.channel).createWebhook(
      user.username,
      {
        avatar: user.displayAvatarURL(),
        reason: "Impersonation"
      }
    );

    await hook.send(content);
    return hook.delete("Impersonation end.");
  }
}
