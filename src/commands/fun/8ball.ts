import { Command } from "@vortekore/lib";
import { Message } from "discord.js";

const answers = [
  "You may rely on it.",
  "Yes – definitely.",
  "Yes.",
  "Without a doubt.",
  "Very doubtful.",
  "Signs point to yes.",
  "Reply hazy, try again.",
  "Outlook good.",
  "Outlook not so good.",
  "My sources say no.",
  "My reply is no.",
  "Most likely.",
  "It is decidedly so.",
  "It is certain.",
  "Don’t count on it.",
  "Concentrate and ask again.",
  "Cannot predict now.",
  "Better not tell you now.",
  "Ask again later.",
  "As I see it, yes."
];

export default class extends Command {
  public constructor() {
    super("8ball", {
      aliases: ["8ball", "8b"],
      description: {
        content: "The magic 8ball will answer you question."
      },
      args: [
        {
          id: "question",
          prompt: {
            start: "Sooo... There is no question?"
          },
          type: "text"
        }
      ]
    });
  }

  public async exec(message: Message, { question }: { question: string }) {
    message.sem(
      `**${question}**\n${answers[Math.floor(Math.random() * answers.length)]}`
    );
  }
}
