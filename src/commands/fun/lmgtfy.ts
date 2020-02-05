import { Command } from "@vortekore/lib";
import { Message } from "discord.js";

export default class extends Command {
  public constructor() {
    super("lmgtfy", {
      aliases: ["lmgtfy"],
      description: {
        content: "Sends a lmgtfy url."
      },
      args: [
        {
          id: "query",
          prompt: {
            start: "Are you gonna provide something?"
          },
          type: "restContent"
        }
      ]
    });
  }

  public async exec(message: Message, { query }: { query: string }) {
    return message.sem(`${encodeURI(`https://lmgtfy.com/?q=${query}`)}`);
  }
}
