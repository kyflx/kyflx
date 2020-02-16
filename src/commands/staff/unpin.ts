import {Command} from "@vortekore/lib";
import {Message} from "discord.js";

export default class extends Command {
	public constructor() {
		super("unpin", {
			aliases: ["unpin", "unpin-message", "unpin-msg"],
			channel: "guild",
			description: t => t("cmds:mod.unpin.desc"),
			userPermissions: ["MANAGE_MESSAGES"],
			clientPermissions: ["MANAGE_MESSAGES"],
			args: [
				{
					id: "msg",
					prompt: {
						start: (_: Message) =>
							_.t("cmds:mod.pin.prompt", {action: "unpin"})
					},
					type: "message"
				}
			]
		});
	}

	public async exec(message: Message, {msg}: { msg: Message }) {
		if (!msg.pinned) return message.sem(message.t("cmds:mod.unpin.not"));
		await msg.unpin();
	}
}
