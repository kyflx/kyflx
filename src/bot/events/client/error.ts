import { Listener } from "../../../lib";

export default class ClientError extends Listener {
  public constructor() {
    super("bot-error", {
      event: "error",
      emitter: "client"
    });
  }

  public async exec(error: Error, bot = this.client) {
    bot.logger.error(error);
  }
}
