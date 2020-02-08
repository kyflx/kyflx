import { Command } from "@vortekore/lib";
import { Message } from "discord.js";

export default class extends Command {
  public constructor() {
    super("invite", {
      aliases: ["invite"],
      description: t => t("cmds:util.inv.desc")
    });
  }

  public async exec(message: Message) {
    return message.sem(
      message.t("cmds:util.inv.res", {
        invite: await this.client.generateInvite(8)
      })
    );
  }
}
