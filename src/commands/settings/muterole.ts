import { Command } from "@vortekore/lib";
import { Message, Role } from "discord.js";

export default class MuteroleCommand extends Command {
  public constructor() {
    super("muterole", {
      aliases: ["mute-role"],
      description: t => t("cmds:conf.mtr.desc"),
      channel: "guild",
      *args(_: Message) {
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
                  start: _.t("cmds:conf.mtr.prompt")
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
      return message.sem(message.t("cmds:conf.mtr.curr", { message }));

    if (action === "clear") {
      message._guild.muteRole = "";
      await message._guild.save();
      return message.sem(message.t("cmds:conf.mtr.clear"));
    }

    message._guild.muteRole = role.id;
    await message._guild.save();
    return message.sem(message.t("cmds:conf.mtr.set", { role }));
  }
}
