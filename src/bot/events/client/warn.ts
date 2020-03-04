import { Listener } from "../../../lib";

export default class BotWarning extends Listener {
  public constructor() {
    super("bot-warn", {
      event: "warn",
      emitter: "client"
    });
  }

  async exec(error: Error) {
    return this.logger.warn(error);
  }
}
