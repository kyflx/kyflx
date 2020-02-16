import {Command, Listener} from "@vortekore/lib";
import {Message} from "discord.js";

export default class MissingPermissionsListener extends Listener {
	public constructor() {
		super("missingPermissions", {
			event: "missingPermissions",
			emitter: "commands"
		});
	}

	public async exec(
		message: Message,
		_c: Command,
		clientOrUser: string,
		missing: string | string[],
	) {
		if (clientOrUser === "client") {
			return message.sem(
				[
					`Sorry, I need to following permissions for me to process your request :(`,
					Array.isArray(missing)
						? missing.map((p, i) => `**${i++}**. ${p}}`)
						: `**1**. ${missing}`
				].join("\n")
			);
		} else if (clientOrUser === "user") {
			if (missing === "DJ")
				return message.sem(
					"Sorry, you need a role called `DJ` to run this command!",
					{type: "error"}
				);
			return message.sem(
				[
					`Sorry, you need the following permissions to run this command`,
					Array.isArray(missing)
						? missing.map((p, i) => `**${++i}**. ${p}`)
						: `**1**. ${missing}`
				].join("\n")
			);
		}
	}
}
