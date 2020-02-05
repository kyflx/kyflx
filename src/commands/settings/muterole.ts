import { Command } from "@vortekore/lib";
import { Message, Role } from "discord.js";

export default class MuteroleCommand extends Command {
  public constructor() {
    super("muterole", {
      aliases: ["mute-role"],
      description: {
        content: "Manages the role used when muting a member.",
        usage: "[clear|set] <[@role|role name|role id]>",
        examples: ["v!muterole", "v!muterole clear", "v!muterole set @Muted"]
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
                  start: "Please provide a role I can use for mutes :/"
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
        `The current mute role is ${
          message._guild.muteRole
            ? `<@&${message._guild.muteRole}> \`(${message._guild.muteRole})\``
            : "is literally nothing..."
        }`
      );

    if (action === "clear") {
      message._guild.muteRole = "";
      await message._guild.save();
      return message.sem(
        "Okay, I cleared the mute role! To set a new one do `muterole set <role>`!"
      );
    }

    message._guild.muteRole = role.id;
    await message._guild.save();
    return message.sem(`Okay, I set the mute role to ${role} \`(${role.id})\``);
  }
}
