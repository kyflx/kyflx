import {Command} from "@vortekore/lib";
import {Message} from "discord.js";
import {results, RPS_Types} from "../../util";

export default class extends Command {
	public constructor() {
		super("rock-paper-scissors", {
			aliases: ["rps"],
			description: t => t("cmds:fun.rps.desc"),
			args: [
				{
					id: "selected",
					prompt: {
						start: (_: Message) => _.t("cmds:fun.rps.prompt")
					},
					type: Object.keys(results)
				}
			]
		});
	}

	public async exec(message: Message, {selected}: { selected: string }) {
		const bot = RPS_Types[Math.floor(Math.random() * RPS_Types.length)];
		return message.sem(
			message.t(
				`cmds:fun.rps.${results[bot][RPS_Types.findIndex(c => c === selected)]}`,
				{bot}
			)
		);
	}
}
