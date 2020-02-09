import {Hook, listen, Queue} from "@vortekore/lib";

export default class QueueHook extends Hook {
    public emitter: Queue;

    @listen("finish")
    // @ts-ignore
    public async finished() {
        this.emitter.player.leave();
        this.emitter.player.destroy();
    }
}
