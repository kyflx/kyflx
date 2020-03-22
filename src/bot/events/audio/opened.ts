import { Listener } from "../../../lib";

export default class NodeOpenedListener extends Listener {
  public constructor() {
    super("node-opened", {
      event: "open",
      emitter: "music"
    });
  }

  public async exec() {
    this.client.logger.info(`Connected to Lavalink`);
  }
}
