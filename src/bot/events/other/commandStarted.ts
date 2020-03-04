import { Listener } from "../../../lib";
import { stats } from "../../..";

export default class CommandStartedListener extends Listener {
	public constructor() {
		super("command-started", {
			emitter: "commands",
			event: "commandStarted",
		});
	}

	public async exec() {
		stats.commands.inc();
	}
}
