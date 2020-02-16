import {Message} from "discord.js";
import {In} from "../../util";
import {Command} from "@vortekore/lib";

export default class SkipCommand extends Command {
	public constructor() {
		super("skip", {
			aliases: ["skip", "🚶", "🏃"],
			description: t => t("cmds:music.skip.desc"),
			channel: "guild",
		});
	}

	public async exec(message: Message) {
		if (!message.guild.me.voice.channel)
			return message.sem(message.t("cmds:music.no_vc"), {
				type: "error"
			});

		if (!In(message.member!))
			return message.sem(message.t("cmds:music.join"), {
				type: "error"
			});

		if (message.player.radio)
			return message.sem(message.t("cmds:music.rad"), {
				type: "error"
			});

		await message.queue._next();
		await message.queue.start();
		return message.sem(message.t("cmds:music.skip.res"));
	}
}
