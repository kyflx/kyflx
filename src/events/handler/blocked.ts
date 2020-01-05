import { Command, Listener } from "@vortekore/lib";
import { Message } from "discord.js";

export default class CommandBlocked extends Listener {
  public constructor() {
    super("command-blocked", {
      event: "commandBlocked",
      emitter: "commands"
    });
  }

  public async exec(
    message: Message,
    command: Command,
    reason: string,
  ) {
    switch (reason) {
      case "owner":
        message.sem("This command can only be used by developers :p", {
          type: "error"
        });
        break;
      case "guild":
        message.sem(
          "Sorry my guy, this command can only be used in guilds :(",
          { type: "error" }
        );
        break;
    }
  }
}
