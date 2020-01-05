import { Listener, Command } from "@vortekore/lib";
import ms from "ms";
import { Message } from "discord.js";

export default class CommandBlocked extends Listener {
  public constructor() {
    super("command-cooldown", {
      event: "cooldown",
      emitter: "commands"
    });
  }

  public async exec(message: Message, command: Command, cooldown: number) {
    message.sem(
      `Sorry, you have ${ms(Date.now() - cooldown)} left on your cooldown :(`,
      { type: "error" }
    );
  }
}
