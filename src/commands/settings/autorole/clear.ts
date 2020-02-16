import {Command} from "@vortekore/lib";
import {Message} from "discord.js";

export default class extends Command {
	public constructor() {
		super("autorole-clear", { category: "flag" });
	}

	public async exec(message: Message) {
		if (!message._guild.autoRoles.length)
			return message.sem(
				message.t("cmds:conf.auto.nothing", {action: "clear"})
			);

		message._guild.autoRoles = [];
		await message._guild.save();
		return message.sem(message.t("cmds:conf.auto.cleared"));
	}
}
