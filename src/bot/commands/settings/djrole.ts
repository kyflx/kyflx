import { Command } from "../../../lib";
import { Message, Role } from "discord.js";
import { Argument } from "discord-akairo";

export default class DJRoleCommand extends Command {
  public constructor() {
    super("dj-role", {
      aliases: ["dj-role", "dj"],
      description: t => t("cmds:conf.dj.desc"),
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
    if (!value) return message.sem(message.t("cmds:conf.dj.cur", { message }));

    if (value === "clear") {
      message._guild.djRole = "";
      await message._guild.save();
      return message.sem(message.t("cmds:conf.dj.clr"));
    }

    message._guild.djRole = value.id;
    await message._guild.save();
    return message.sem(message.t("cmds:conf.dj.done", { role: value }));
  }
}
