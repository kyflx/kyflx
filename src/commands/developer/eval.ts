import {Command, VorteEmbed} from "@vortekore/lib";
import {Message} from "discord.js";
import {isPromise} from "../../util";

export default class extends Command {
	public constructor() {
		super("eval", {
			aliases: ["eval", "evaluate"],
			description: t => t("cmds:dev.eval.desc"),
			ownerOnly: true,
			args: [
				{
					id: "code",
					prompt: {
						start: "Provide some code to evaluate."
					},
					match: "rest"
				},
				{
					id: "depth",
					match: "option",
					flag: ["-d=", "d:", "--depth=", "--depth:"]
				}
			]
		});
	}

	public async exec(
		message: Message,
		{code, depth}: { code: string; depth: number }
	) {
		try {
			let resulted = eval(code);
			if (isPromise(resulted)) resulted = await resulted;

			const ctype = typeof resulted;
			if (typeof resulted !== "string")
				resulted = require("util").inspect(resulted, {
					depth: depth || 0
				});

			return message.util.send(
				new VorteEmbed(message)
					.baseEmbed()
					.addField("Input", `\`\`\`js\n${code}\`\`\``)
					.addField("Output", `\`\`\`js\n${resulted.trunc(1000, true)}\`\`\``)
					.addField("\u200b", `**Type**: ${ctype}`, true)
			);
		} catch (e) {
			this.logger.error(e, "eval");
			return message.util.send(
				new VorteEmbed(message)
					.errorEmbed()
					.addField("Input", `\`\`\`js\n${code}\`\`\``)
					.addField("Error", `\`\`\`js\n${e.name}: ${e.message}\`\`\``)
			);
		}
	}
}
