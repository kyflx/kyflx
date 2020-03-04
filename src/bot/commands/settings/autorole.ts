import { Command, VorteEmbed } from "../../../lib";
import { Message } from "discord.js";
import { Flag } from "discord-akairo";

export default class extends Command {
  public constructor() {
    super("autorole", {
      aliases: ["auto-role", "ar"],
      description: t => t("cmds:conf.auto.desc"),
      channel: "guild",
      userPermissions: "MANAGE_ROLES",
      clientPermissions: "MANAGE_ROLES",
      *args(_: Message) {
        const method = yield {
          type: ["add", ["remove", "delete", "rm", "del"], ["clear", "reset"]],
          otherwise: (_: Message) =>
            new VorteEmbed(_)
              .baseEmbed()
              .setDescription(_.t("cmds:conf.auto.curr", { message: _ }))
        };

        return Flag.continue(`autorole-${method}`);
      }
    });
  }
}
