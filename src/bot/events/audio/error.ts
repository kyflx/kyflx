import { Listener } from "../../../lib";

export default class LavalinkError extends Listener {
  public constructor() {
    super("lavalink-error", {
      event: "error",
      emitter: "music"
    });
  }

  public async exec(error: Error) {
    this.client.logger.warn(error);
  }
}
