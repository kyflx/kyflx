import {Command} from "@vortekore/lib";
import {Message} from "discord.js";
import {Argument} from "discord-akairo";

export default class extends Command {
	public constructor() {
		super("prefix-remove", {
			args: [
				{
					id: "prefix",
					type: Argument.range("string", 1, 5),
					prompt: {
						start: (_: Message) => _.t("cmds:conf.prf.start"),
						retry: (_: Message) => _.t("cmds:conf.prf.retry")
					}
				}
			],
			category: "flag"
		});
	}

	public async exec(message: Message, {prefix}: { prefix: string }) {
		if (! message._guild.prefixes.some(s => s.ignoreCase(prefix)))
			return message.sem(message.t("cmds:conf.prf.!exists"), {
			type: "error"
		});

		message._guild.prefixes.splice(message._guild.prefixes.findIndex(s =>
			s.ignoreCase(prefix)
		), 1);

		await message._guild.save();
		return message.sem(message.t("cmds:conf.prf.rmed", {guild: message._guild, prefix}));
	}
}
