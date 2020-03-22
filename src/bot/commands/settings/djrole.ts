import { Argument } from "discord-akairo";
import { Message, Role } from "discord.js";
import { Command } from "../../../lib";

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
      await this.updateDb(message.guild, "djRole", "");
      return message.sem(message.t("cmds:conf.dj.clr"));
    }

    await this.updateDb(message.guild, "djRole", value.id);
    return message.sem(message.t("cmds:conf.dj.done", { role: value }));
  }
}
