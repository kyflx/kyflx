import { stats } from "../../..";
import { Listener } from "../../../lib";

export default class CommandStartedListener extends Listener {
  public constructor() {
    super("command-started", {
      emitter: "commands",
      event: "commandStarted"
    });
  }

  public async exec() {
    stats.commands.inc();
  }
}
