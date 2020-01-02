import { Command } from "@vortekore/lib";
import { Message } from "discord.js";

const choices = ["rock", "paper", "scissors"];

export default class extends Command {
  public constructor() {
    super("rock-paper-scissors", {
      aliases: ["rps"],
      description: {
        content: "Play rock paper scisssors with VorteKore",
        examples: ["v!rps rock", "v!rps scissors"],
        usage: "<rock|paper|scissors>"
      },
      args: [
        {
          id: "selected",
          prompt: {
            retry:
              "Sooo... Playing Rock Paper Scissors against Air doesn't work?"
          },
          type: ["rock", "paper", "scissors"]
        }
      ]
    });
  }

  public async exec(message: Message, { selected }: { selected: string }) {
    const botChoice = choices[Math.floor(Math.random() * choices.length)];
    if (botChoice == "rock") {
      if (selected.ignoreCase("rock"))
        message.sem(`I choose: ${botChoice}, It's a tie!`);
      else if (selected.ignoreCase("paper"))
        message.sem(`I choose: ${botChoice}, You won!`);
      else message.sem(`I choose ${botChoice}, I win!`);
    } else if (botChoice == "scissors") {
      if (selected.ignoreCase("rock"))
        message.sem(`I choose: ${botChoice}, You won!`);
      else if (selected.ignoreCase("scissors"))
        message.sem(`I choose: ${botChoice}, It's a tie!`);
      else message.sem(`I choose ${botChoice}, I win!`);
    } else if (botChoice == "paper") {
      if (selected.ignoreCase("scissors"))
        message.sem(`I choose: ${botChoice}, You won!`);
      else if (selected.ignoreCase("paper"))
        message.sem(`I choose: ${botChoice}, It's a tie!`);
      else message.sem(`I choose ${botChoice}, I win!`);
    }
  }
}
