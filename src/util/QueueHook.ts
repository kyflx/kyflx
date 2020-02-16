import {Hook, listen, Queue} from "@vortekore/lib";

export default class QueueHook extends Hook {
	public emitter: Queue;

	@listen("finish")
	public async finished() {
		await this.emitter.player.leave();
		await this.emitter.player.destroy();
	}
}
