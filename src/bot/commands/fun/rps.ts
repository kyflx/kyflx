import { Message } from "discord.js";
import { Command, results, rpsTypes } from "../../../lib";

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
    const bot = rpsTypes[Math.floor(Math.random() * rpsTypes.length)];
    return message.sem(
      message.t(
        `cmds:fun.rps.${
          results[bot][rpsTypes.findIndex(c => c === selected)]
        }`,
        { bot }
      )
    );
  }
}
