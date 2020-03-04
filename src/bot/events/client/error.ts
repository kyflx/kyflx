import { Listener } from "../../../lib";

export default class ClientError extends Listener {
  public constructor() {
    super("bot-error", {
      event: "error",
      emitter: "client"
    });
  }

  async exec(error: Error, bot = this.client) {
    return bot.logger.error(error);
  }
}
  