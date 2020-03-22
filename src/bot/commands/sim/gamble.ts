import { Argument } from "discord-akairo";
import { Message } from "discord.js";
import { Command } from "../../../lib";

export default class extends Command {
  public constructor() {
    super("gamble", {
      aliases: ["gamble", "g"],
      description: t => t("cmds:eco.gb.desc"),
      cooldown: 50000,
      args: [
        {
          id: "amount",
          type: Argument.range("number", 1, 1001),
          prompt: {
            start: (_: Message) => _.t("cmds:eco.gb.prompt")
          }
        }
      ]
    });
  }

  public async exec(message: Message, { amount }: { amount: number }) {
    if (message.profile.coins < amount)
      return message.sem(message.t("cmds:eco.gb.insuf"), { type: "error" });

    const random = Math.random();
    random >= 0.5
      ? (message.profile.coins += amount)
      : (message.profile.coins -= amount);
    await message.profile.save();

    return message.sem(
      message.t(`cmds:eco.gb.${random >= 0.5 ? "win" : "lose"}`, {
        coins: amount
      })
    );
  }
}
