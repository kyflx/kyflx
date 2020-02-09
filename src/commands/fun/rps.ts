import { Command } from "@vortekore/lib";
import { Message } from "discord.js";

const results: Record<"rock" | "paper" | "scissors", string[]> = {
    rock: ["tie", "lost", "win"],
    paper: ["win", "tie", "lost"],
    scissors: ["lost", "win", "tie"]
  },
  types = Object.keys(results);

export default class extends Command {
  public constructor() {
    super("rock-paper-scissors", {
      aliases: ["rps"],
      description: t => t("cmds:fun.rps.desc"),
      args: [
        {
          id: "selected",
          prompt: {
            start: (_: Message) => _.t("cmds:fun.rps.prompt")
          },
          type: Object.keys(results)
        }
      ]
    });
  }

  public async exec(message: Message, { selected }: { selected: string }) {
    const bot = types[Math.floor(Math.random() * types.length)];
    return message.sem(
      message.t(
        `cmds:fun.rps.${results[bot][types.findIndex(c => c === selected)]}`,
        { bot }
      )
    );
  }
}
