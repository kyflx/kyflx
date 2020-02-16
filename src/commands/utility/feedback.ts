import {Command, VorteEmbed} from "@vortekore/lib";
import {Message, TextChannel} from "discord.js";

export default class FeedbackCommand extends Command {
	public constructor() {
		super("feedback", {
			aliases: ["feedback", "thoughts"],
			description: t => t("cmds:util.fb.desc"),
			args: [
				{
					id: "feedback",
					match: "rest",
					prompt: {
						start: (_: Message) => _.t("cmds:util.fb.prompt")
					}
				}
			]
		});
	}

	public async exec(message: Message, {feedback}: { feedback: string }) {
		const Feedback = new VorteEmbed(message)
			.baseEmbed()
			.setAuthor(message.author.tag, message.author.displayAvatarURL())
			.setDescription(feedback)
			.addField(
				"\u200b",
				`**Sent From**: ${
					message.guild ? `${message.guild.name} (${message.guild.id})` : "DMs"
				} `
			);
		await (<TextChannel>this.client.channels.resolve("631151085150797833")!).send(
			Feedback
		);
		return message.sem(message.t("cmds:util.fb.sent"));
	}
}
