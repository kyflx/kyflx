import { Command } from "../../../lib";
import { Message, Role } from "discord.js";
import { Argument } from "discord-akairo";

export default class MuteRoleCommand extends Command {
  public constructor() {
    super("mute-role", {
      aliases: ["mute-role"],
      description: t => t("cmds:conf.mtr.desc"),
      channel: "guild",
      args: [
        {
          id: "value",
          type: Argument.union([["clear", "reset", "revert"]], "role")
        }
      ]
    });
  }

  public async exec(message: Message, { value }: { value: "clear" | Role }) {
    if (!value)
      return message.sem(message.t("cmds:conf.mtr.curr", { message }));

    if (value === "clear") {
      message._guild.muteRole = "";
      await message._guild.save();
      return message.sem(message.t("cmds:conf.mtr.clear"));
    }

    message._guild.muteRole = value.id;
    await message._guild.save();
    return message.sem(message.t("cmds:conf.mtr.set", { role: value }));
  }
}
