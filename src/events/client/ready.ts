import {CaseEntity, Listener} from "@vortekore/lib";
import WebServer from "../../web/server";
import DBL from "dblapi.js";
import ms from "ms";

export default class BotReady extends Listener {
	public constructor() {
		super("bot-ready", {
			event: "ready",
			emitter: "client"
		});
	}

	async exec(client = this.client) {
		new WebServer(client).init();
		client.user!.setPresence({
			activity: {
				name: "VorteKore | v!help",
				type: "STREAMING",
				url: "https://twitch.tv/vortekore"
			}
		});

		if (process.env.NODE_ENV === "production") {
			const dbl = new DBL(client.config.get("DBL_TOKEN"), this.client);
			setInterval(() => dbl.postStats(this.client.guilds.cache.size), 120000);
		}

		[
			this.client.database.guilds.items,
		].map((c) =>
			setInterval(() => c.clear(), ms("30m"))
		);

		client.logger.info(`${client.user!.username} is ready to rumble!`);
	}
}
