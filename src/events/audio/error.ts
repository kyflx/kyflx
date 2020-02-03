import { Listener } from "@vortekore/lib";

export default class extends Listener {
  public constructor() {
    super("andesite-error", {
      event: "error",
      emitter: "music"
    });
  }

  async exec(error: Error) {
    return this.client.logger.warn(error);
  }
}
