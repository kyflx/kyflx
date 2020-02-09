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

  public async exec(message: Message, _: Command, remaining: number) {
    message.sem(message.t("evts:cmds.cooldown", { remaining }), {
      type: "error"
    });
  }
}
