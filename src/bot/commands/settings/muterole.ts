import { Argument } from "discord-akairo";
import { Message, Role } from "discord.js";
import { Command } from "../../../lib";

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
      await this.updateDb(message.guild, "muteRole", "");
      return message.sem(message.t("cmds:conf.mtr.clear"));
    }

    await this.updateDb(message.guild, "muteRole", value.id);
    return message.sem(message.t("cmds:conf.mtr.set", { role: value }));
  }
}
