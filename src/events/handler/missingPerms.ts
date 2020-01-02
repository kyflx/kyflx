import { Command, Listener } from "@vortekore/lib";
import { Message } from "discord.js";

export default class CommandBlocked extends Listener {
  public constructor() {
    super("missingPermissions", {
      event: "missingPermissions",
      emitter: "commands"
    });
  }

  public async run(
    message: Message,
    _c: Command,
    clientOrUser: string,
    missing: string | string[],
  ) {
    switch (clientOrUser) {
      case "client":
        message.sem(
          [
            `Sorry, I need to following permissions for me to process your request :(`,
            Array.isArray(missing)
              ? missing.map((p, i) => `**${i++}**. ${p}}`)
              : `**1**. ${missing}`
          ].join("\n")
        );
        break;
      case "user":
        if (missing === "DJ")
          return message.sem(
            "Sorry, you need a role called `DJ` to run this command!",
            { type: "error" }
          );
        message.sem(
          [
            `Sorry, you need the following permissions to run this command`,
            Array.isArray(missing)
              ? missing.map((p, i) => `**${++i}**. ${p}`)
              : `**1**. ${missing}`
          ].join("\n")
        );
        break;
    }
  }
}
