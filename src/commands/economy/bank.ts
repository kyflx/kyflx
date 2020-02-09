import { Command, VorteEmbed } from "@vortekore/lib";
import { Message } from "discord.js";

export default class extends Command {
  public constructor() {
    super("bank", {
      aliases: ["bank"],
      description: t => t("cmds:eco.bk.desc"),
      cooldown: 5000,
      args: [
        {
          id: "action",
          default: "help",
          type: [["deposit", "dep"], "withdraw", "help"]
        },
        {
          id: "amount",
          default: 0,
          type: "number"
        }
      ]
    });
  }

  public async exec(
    message: Message,
    { action, amount }: { action: string; amount: number }
  ) {
    const bankEmbed = new VorteEmbed(message)
      .baseEmbed()
      .setTitle("Bank")
      .setDescription(message.t("cmds:eco.bk.emdesc"));

    switch (action) {
      case "deposit":
        if (!amount)
          return message.sem(
            message.t("cmds:eco.bk.prompt", { locale: "deposit" }),
            { type: "error" }
          );
        if (isNaN(amount) || amount > message.profile.coins)
          return message.sem(message.t("cmds:eco.bk.insuf"), { type: "error" });
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
        await message.profile.save().catch();

        message.sem(
          message.t("cmds:eco.bk.suc", { locale: "deposited", amount })
        );
        break;
      case "withdraw":
        if (!amount)
          return message.sem(
            message.t("cmds:eco.bk.prompt", { locale: "withdraw" }),
            { type: "error" }
          );
        if (isNaN(amount) || amount > message.profile.bank)
          return message.sem(message.t("cmds:eco.bk.insuf"), { type: "error" });

        message.profile.bank -= amount;
        message.profile.coins += amount;
        await message.profile.save().catch();

        message.sem(
          message.t("cmds:eco.bk.suc", { locale: "withdrew", amount })
        );
        break;
      case "help":
      default:
        message.channel.send(bankEmbed);
        break;
    }
  }
}
