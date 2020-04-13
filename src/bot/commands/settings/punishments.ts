import { Flag } from "discord-akairo";
import { Message } from "discord.js";
import { Command, KyflxEmbed } from "../../../lib";

export default class PunishmentsCommand extends Command {
  public constructor() {
    super("punishments", {
      aliases: ["punishments", "warn-punishments"],
      description: t => t("cmds:conf.puns.desc"),
      channel: "guild",
      *args(_: Message) {
        const action = yield {
          type: [["remove", "del", "delete"], ["set", "add", "new"], "clear"],
          otherwise: new KyflxEmbed(_).setDescription(
            _.t("cmds:conf.puns.curr", { _ })
          )
        };

        return Flag.continue(`punishments-${action}`);
      }
    });
  }
}
