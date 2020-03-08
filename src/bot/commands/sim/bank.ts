import { Command, VorteEmbed } from "../../../lib";
import { Message } from "discord.js";
import { Flag } from "discord-akairo";

export default class extends Command {
  public constructor() {
    super("bank", {
      aliases: ["bank"],
      description: t => t("cmds:eco.bk.desc"),
      cooldown: 5000,
      *args(_: Message) {
        const action = yield {
          type: [["deposit", "dep"], "withdraw", "upgrade"],
          otherwise: new VorteEmbed(_)
            .setTitle("Bank")
            .setDescription(_.t("cmds:eco.bk.cur", { _ }))
        };

        return Flag.continue(`bank-${action}`);
      }
    });
  }
}
