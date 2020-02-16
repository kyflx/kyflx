import {Command} from "@vortekore/lib";
import {Message, Role} from "discord.js";

export default class extends Command {
	public constructor() {
		super("autorole-add", {
			args: [
				{
					id: "roles",
					match: "separate",
					type: "role",
					prompt: {
						start: (_: Message) => _.t("cmds:conf.auto.prompt")
					}
				}
			],
			category: "flag"
		});
	}

	public async exec(message: Message, {roles}: { roles: Role[] }) {
		const filtered = roles.filter(
			r => !message._guild.autoRoles.includes(r.id)
		);
		if (!filtered.length)
			return message.sem(message.t("cmds:conf.auto.already"));

		message._guild.autoRoles.push(...filtered.map(r => r.id));
		await message._guild.save();

		return message.sem(message.t("cmds:conf.auto.set", {roles: filtered}));
	}
}
