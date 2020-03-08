import { Command, get, VorteEmbed, FUN_LINKS } from "../../../lib";
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
    const { error, data } = await get<{ response: string; url: string }>(
      FUN_LINKS["8ball"]
    );
    if (error || !data) {
      const answers = message.t("cmds:fun.8b.answers");
      return message.sem(answers[Math.floor(Math.random() * answers.length)]);
    }

    return message.util.send(
      new VorteEmbed(message).setDescription(`*${question}*`).setImage(data.url)
    );
  }
}
