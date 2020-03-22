import { Message } from "discord.js";
import { Command, confirm } from "../../../../lib";

export default class PunishmentsRemove extends Command {
  public constructor() {
    super("punishments-clear", {
      category: "flag",
      args: [
        {
          id: "yes",
          match: "flag",
          flag: ["-y", "--yes", ":y"]
        }
      ]
    });
  }

  public async exec(message: Message, { yes }: { yes: boolean }) {
    if (!yes) {
      const confirmation = confirm(
        message,
        message.t("cmds:conf.puns.confirm")
      );
      if (!confirmation) return message.sem(message.t("cmds:conf.puns.cancel"));
    }

    await this.updateDb(message.guild, "warnPunishments", []);
    return message.sem(message.t("cmds:conf.puns.clear"));
  }
}
