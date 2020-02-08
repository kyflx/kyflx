import { Command } from "@vortekore/lib";
import { Message } from "discord.js";

export default class extends Command {
  public constructor() {
    super("lmgtfy", {
      aliases: ["lmgtfy"],
      description: t => t("cmds:fun.lgy.desc"),
      args: [
        {
          id: "query",
          prompt: {
            start: (_: Message) => _.t("cmds:fun.lgy.prompt")
          },
          type: "restContent"
        }
      ]
    });
  }

  public async exec(message: Message, { query }: { query: string }) {
    return message.sem(`https://lmgtfy.com/?q=${query}`);
  }
}
