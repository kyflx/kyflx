import { Message } from "discord.js";
import { Command } from "../../../../lib";

export default class extends Command {
  public constructor() {
    super("autorole-clear", { category: "flag" });
  }

  public async exec(message: Message) {
    if (!message._guild.autoRoles.length)
      return message.sem(
        message.t("cmds:conf.auto.nothing", { action: "clear" })
      );

    await message.update("autoRoles", []);
    return message.sem(message.t("cmds:conf.auto.cleared"));
  }
}
