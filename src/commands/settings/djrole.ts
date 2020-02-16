import {Command} from "@vortekore/lib";
import {Message, Role} from "discord.js";

export default class DJRoleCommand extends Command {
	public constructor() {
		super("dj-role", {
			aliases: ["dj-role", "dj"],
			description: t => t("cmds:conf.dj.desc"),
			channel: "guild",
			* args() {
				const action = yield {
					type: [
						["clear", "reset", "revert"],
						["set", "set-role"]
					]
				};

				const role =
					action === "set"
						? yield {
							type: "role",
							prompt: {
								start: (_: Message) => _.t("cmds:conf.dj.prompt")
							}
						}
						: {};

				return {action, role};
			}
		});
	}

	public async exec(
		message: Message,
		{action, role}: { action: "clear" | "set"; role: Role }
	) {
		if (!(action && role))
			return message.sem(message.t("cmds:conf.dj.cur", {message}));

		if (action === "clear") {
			message._guild.djRole = "";
			await message._guild.save();
			return message.sem(message.t("cmds:conf.dj.clr"));
		}

		message._guild.djRole = role.id;
		await message._guild.save();
		return message.sem(message.t("cmds:conf.dj.done", {role}));
	}
}
