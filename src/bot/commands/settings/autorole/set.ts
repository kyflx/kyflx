import { Message, Role } from "discord.js";
import { Command } from "../../../../lib";

export default class extends Command {
  public constructor() {
    super("autorole-add", {
      args: [
        {
          id: "roles",
          match: "separate",
          type: "role",
          prompt: {
            start: (_: Message) => _.t("cmds:conf.auto.prompt")
          }
        }
      ],
      category: "flag"
    });
  }

  public async exec(message: Message, { roles }: { roles: Array<Role> }) {
    const filtered = roles.filter(
      r => !message._guild.autoRoles.includes(r.id)
    );
    if (!filtered.length)
      return message.sem(message.t("cmds:conf.auto.already"));

    message._guild.autoRoles.push(...filtered.map(r => r.id));
    await this.updateDb(message.guild, "autoRoles", message._guild.autoRoles);
    return message.sem(message.t("cmds:conf.auto.set", { roles: filtered }));
  }
}
