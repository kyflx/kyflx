import { Listener } from "../../../lib";

export default class BotWarning extends Listener {
  public constructor() {
    super("bot-warn", {
      event: "warn",
      emitter: "client"
    });
  }

  public async exec(error: Error) {
    this.logger.warn(error);
  }
}
