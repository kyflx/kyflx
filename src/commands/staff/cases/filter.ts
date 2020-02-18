import { Command } from "@vortekore/lib";
import { Message } from "discord.js";

export default class CaseEdit extends Command {
	public constructor() {
		super("automod-filter", {
      category: "flag",
			args: [{}]
		})
	}

	public async exec(message: Message, {}: {}) {

	}
}