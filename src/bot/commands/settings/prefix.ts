import { Command, VorteEmbed } from "../../../lib";
import { Message } from "discord.js";
import { Flag } from "discord-akairo";

export default class extends Command {
  public constructor() {
    super("prefix", {
      aliases: ["prefix", "prefixes"],
      description: t => t("cmds:conf.prf.desc"),
      channel: "guild",
      userPermissions: ["MANAGE_GUILD"],
      *args(_: Message) {
        const action = yield {
          type: [
            ["add", "new"],
            ["remove", "delete", "rm"]
          ],
          otherwise: (_: Message) =>
            new VorteEmbed(_).setDescription(
              _.t("cmds:conf.prf.curr", { message: _ })
            )
        };

        return Flag.continue(`prefix-${action}`);
      }
    });
  }
}
