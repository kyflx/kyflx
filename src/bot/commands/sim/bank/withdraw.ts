import { Command } from "../../../../lib";
import { Message } from "discord.js";
import { Argument } from "discord-akairo";

export default class DepositCommand extends Command {
  public constructor() {
    super("bank-withdraw", {
      category: "flag",
      *args(message: Message) {
        return {
          amount: yield {
            type: Argument.range("number", 0, message.profile.bank + 1),
            prompt: {
              start: message.t("cmds:eco.bk.with", { message })
            }
          }
        };
      }
    });
  }

  public async exec(message: Message, { amount }: { amount: number }) {
		message.profile.coins += amount;
    message.profile.bank -= amount;
    await message.profile.save();

    return message.sem(
      message.t("cmds:eco.bk.suc", { locale: "withdrew", amount })
    );
  }
}
