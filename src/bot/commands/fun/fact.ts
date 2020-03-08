import { Command, get, VorteEmbed, FUN_LINKS } from "../../../lib";
import { Message } from "discord.js";

export default class extends Command {
  public constructor() {
    super("fact", {
      aliases: ["fact"],
      description: t => t("cmds:fun.fact.desc")
    });
  }

  public async exec(message: Message, { question }: { question: string }) {
    const { error, data } = await get<{ fact: string }>(FUN_LINKS.fact);
    if (error || !data) {
      const answers = message.t("cmds:fun.8b.answers");
      return message.sem(answers[Math.floor(Math.random() * answers.length)]);
    }

    return message.util.send(new VorteEmbed(message).setDescription(data.fact));
  }
}
