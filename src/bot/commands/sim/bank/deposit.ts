import { Command } from "../../../../lib";
import { Message } from "discord.js";
import { Argument } from "discord-akairo";

export default class DepositCommand extends Command {
  public constructor() {
    super("bank-deposit", {
      category: "flag",
      *args(message: Message) {
        return {
          amount: yield {
            type: Argument.range("number", 0, message.profile.coins + 1),
            prompt: {
              start: message.t("cmds:eco.bk.dep", { message })
            }
          }
        };
      }
    });
  }

  public async exec(message: Message, { amount }: { amount: number }) {
    if (
      amount > message.profile.upgrades.bank ||
      amount + message.profile.bank > message.profile.upgrades.bank
    )
      return message.sem(
        message.t("cmds:eco.bk.limit", {
          max: message.profile.upgrades.bank
        })
      );

    message.profile.bank += amount;
    message.profile.coins -= amount;
    await message.profile.save();

    return message.sem(
      message.t("cmds:eco.bk.suc", { locale: "deposited", amount })
    );
  }
}
