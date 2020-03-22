import { Argument } from "discord-akairo";
import { Message } from "discord.js";
import { Command, confirm } from "../../../../lib";

export default class UpgradeCommand extends Command {
  public constructor() {
    super("bank-upgrade", {
      category: "flag",
      args: [
        {
          id: "amount",
          type: Argument.range("number", 1, 11),
          default: 1
        },
        {
          id: "yes",
          match: "flag",
          flag: ["-y", "--yes", ":y"]
        }
      ]
    });
  }

  public async exec(
    message: Message,
    { amount, yes }: { amount: number; yes: boolean }
  ) {
    const cost = amount * 200;

    if (!yes) {
      const verification = await confirm(
        message,
        message.t("cmds:eco.bk.confirm", { cost, amount })
      );
      if (!verification) return message.sem(message.t("cmds:eco.bk.cancelled"));
    }

    if (message.profile.coins < cost)
      return message.sem(message.t("cmds:eco.bk.insuf"));

    message.profile.coins -= cost;
    message.profile.upgrades.bank += amount * 500;
    await message.profile.save();

    return message.sem(
      message.t("cmds:eco.bk.upg", {
        max: message.profile.upgrades.bank,
        cost
      })
    );
  }
}
