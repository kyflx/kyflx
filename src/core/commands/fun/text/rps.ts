import { Message } from "discord.js";
import { Command, CommandOptions } from "klasa";
import { Init } from "../../../../lib";

const results: Record<"rock" | "paper" | "scissors", Array<string>> = {
    rock: ["tie", "lost", "win"],
    paper: ["win", "tie", "lost"],
    scissors: ["lost", "win", "tie"],
  },
  rpsTypes = Object.keys(results);

@Init<CommandOptions>({ usage: "<rock|paper|scissors>" })
export default class EightBallCommand extends Command {
  public async run(message: Message, [user]: [string]) {
    const bot = rpsTypes[Math.floor(Math.random() * rpsTypes.length)];
    return message.reply(
      message.t(
        `fun.rps.${results[bot][rpsTypes.findIndex((c) => c === user)]}`,
        bot
      )
    );
  }
}
