import { EmitterHook, Queue, listen } from "../classes";

export default class QueueHook extends EmitterHook {
  public emitter: Queue;

  @listen("finish")
  public async finished() {
    await this.emitter.player.leave();
    await this.emitter.player.destroy();
  }
}
