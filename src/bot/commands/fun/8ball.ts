import { Command } from "../../../lib";
import { Message } from "discord.js";

export default class extends Command {
  public constructor() {
    super("8ball", {
      aliases: ["8ball", "8b"],
      description: t => t("cmds:fun.8b.desc"),
      args: [
        {
          id: "question",
          prompt: {
            start: (_: Message) => _.t("cmds:fun.8b.pmt")
          },
          type: "string",
          match: "rest"
        }
      ]
    });
  }

  public async exec(message: Message, { question }: { question: string }) {
    const answers = message.t<string[]>("cmds:fun.8b.answers");
    await message.sem(
      `**${question}**\n${answers[Math.floor(Math.random() * answers.length)]}`
    );
  }
}
