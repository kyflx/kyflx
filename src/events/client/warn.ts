import { Listener } from "@vortekore/lib";

export default class extends Listener {
  public constructor() {
    super("bot-warn", {
      event: "warn",
      emitter: "client"
    });
  }

  async exec(error: Error, bot = this.client) {
    return this.logger.warn(error);
  };
}