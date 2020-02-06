import { Hook, Queue, listen } from "@vortekore/lib";

export default class QueueHook extends Hook {
  public emitter: Queue;

  @listen("finish")
  public async finished() {
		this.emitter.player.destroy();
  }
}
