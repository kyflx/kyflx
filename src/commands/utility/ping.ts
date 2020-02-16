import {Command} from "@vortekore/lib";
import {Message} from "discord.js";

export default class PingCommand extends Command {
	public constructor() {
		super("ping", {
			aliases: ["ping", "pong"],
			description: t => t("cmds:util.ping.desc"),
			typing: false
		});
	}

	public async exec(message: Message) {
		const start = Date.now();
		return new Promise(resolve => {
			(<any>this.client["api"]).channels[message.channel.id].typing
				.post()
				.then(() => {
					return resolve(
						message.sem(
							message.t("cmds:util.ping.res", {
								bot: this.client.ws.ping,
								api: Date.now() - start
							})
						)
					);
				});
		});
	}
}
