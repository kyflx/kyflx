import { Command, VorteEmbed } from "@vortekore/lib";
import { Argument, Flag } from "discord-akairo";
import { Message } from "discord.js";

export default class WarnsCommand extends Command {
  public constructor() {
    super("cases", {
      aliases: ["cases"],
      description: t => t("cmds:mod.warns.desc"),
      channel: "guild",
      *args(_: Message) {
        const action = yield {
          type: Argument.union([
            ["view", "get"],
            ["clear", "reset"],
            ["remove", "del", "delete"],
            "filter",
            ["edit", "change"]
          ]),
          otherwise: new VorteEmbed(_).setDescription(
            _.t("cmds:mod.cases.stats", { _ })
          )
        };

        return Flag.continue(`cases-${action}`);
      }
    });
  }
}
