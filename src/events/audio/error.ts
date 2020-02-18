import { Listener } from "@vortekore/lib";

export default class LavalinkError extends Listener {
  public constructor() {
    super("lavalink-error", {
      event: "error",
      emitter: "music"
    });
  }

  async exec(error: Error) {
    return this.client.logger.warn(error);
  }
}
