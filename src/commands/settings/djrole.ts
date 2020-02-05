import { Command } from "@vortekore/lib";
import { Message, Role } from "discord.js";

export default class MuteroleCommand extends Command {
  public constructor() {
    super("djrole", {
      aliases: ["dj-role", "dj"],
      description: {
        content: "Manages the role used for controlling the music player.",
        usage: "[clear|set] <[@role|role name|role id]>",
        examples: ["v!djrole", "v!djrole clear", "v!djrole set @Muted"]
      },
      channel: "guild",
      *args() {
        const action = yield {
          type: [
            ["clear", "reset", "revert"],
            ["set", "set-role"]
          ]
        };

        const role =
          action === "set"
            ? yield {
                type: "role",
                prompt: {
                  start: "Please provide a role I can use for DJs :/"
                }
              }
            : {};

        return { action, role };
      }
    });
  }

  public async exec(
    message: Message,
    { action, role }: { action: "clear" | "set"; role: Role }
  ) {
    if (!(action && role))
      return message.sem(
        `The current DJ role is ${
          message._guild.djRole
            ? `<@&${message._guild.djRole}> \`(${message._guild.djRole})\``
            : "is literally nothing..."
        }`
      );

    if (action === "clear") {
      message._guild.djRole = "";
      await message._guild.save();
      return message.sem(
        "Okay, I cleared the DJ role! To set a new one do `djrole set <role>`!"
      );
    }

    message._guild.djRole = role.id;
    await message._guild.save();
    return message.sem(`Okay, I set the DJ role to ${role} \`(${role.id})\``);
  }
}
