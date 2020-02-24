import { Command, VorteEmbed } from "@vortekore/lib";
import { Message } from "discord.js";
import { Flag } from "discord-akairo";

export default class PunishmentsCommand extends Command {
  public constructor() {
    super("punishments", {
      aliases: ["punishments", "warn-punishments"],
      description: t => t("cmds:conf.puns.desc"),
      channel: "guild",
      *args(_: Message) {
        const action = yield {
          type: [
            ["remove", "del", "delete"],
            ["set", "add", "new"]
          ],
          otherwise: new VorteEmbed(_).setDescription(
            _.t("cmds:conf.puns.curr", { _ })
          )
        };

        return Flag.continue(`punishments-${action}`);
      }
    });
  }
}
