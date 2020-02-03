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
    let botChoice = choices[Math.floor(Math.random() * choices.length)],
      msg;
    if (botChoice == "rock") {
      if (selected.ignoreCase("rock"))
        msg = `I choose: ${botChoice}, It's a tie!`;
      else if (selected.ignoreCase("paper"))
        msg = `I choose: ${botChoice}, You won!`;
      else msg = `I choose ${botChoice}, I win!`;
    } else if (botChoice == "scissors") {
      if (selected.ignoreCase("rock")) msg = `I choose: ${botChoice}, You won!`;
      else if (selected.ignoreCase("scissors"))
        msg = `I choose: ${botChoice}, It's a tie!`;
      else msg = `I choose ${botChoice}, I win!`;
    } else if (botChoice == "paper") {
      if (selected.ignoreCase("scissors"))
        msg = `I choose: ${botChoice}, You won!`;
      else if (selected.ignoreCase("paper"))
        msg = `I choose: ${botChoice}, It's a tie!`;
      else msg = `I choose ${botChoice}, I win!`;
    }
    return message.sem(msg);
  }
}
