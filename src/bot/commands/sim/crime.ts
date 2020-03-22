import { Message } from "discord.js";
import { Command } from "../../../lib";

export default class extends Command {
  public constructor() {
    super("crime", {
      aliases: ["crime"],
      description: t => t("cmds:eco.cr.desc"),
      cooldown: 50000
    });
  }

  public async exec(message: Message) {
    let crime = message.t("cmds:eco.cr.crimes");
    crime = crime[Math.floor(Math.random() * crime.length)];

    const amount = Math.floor(Math.random() * message.profile.coins),
      res = Math.random() >= 0.5;

    await message.sem(
      message.t(`cmds:eco.cr.${res ? "succ" : "lose"}`, {
        crime,
        amount
      })
    );
    res ? (message.profile.coins += amount) : (message.profile.coins -= amount);

    return message.profile.save();
  }
}
