import { Command, Listener } from "@vortekore/lib";
import { Message } from "discord.js";

export default class CommandBlocked extends Listener {
  public constructor() {
    super("command-blocked", {
      event: "commandBlocked",
      emitter: "commands"
    });
  }

  public async exec(message: Message, _: Command, reason: string) {
    switch (reason) {
      case "guild":
      case "owner":
        await message.sem(message.t(`evts:cmds.${reason}`), { type: "error" });
        break;
    }
  }
}
