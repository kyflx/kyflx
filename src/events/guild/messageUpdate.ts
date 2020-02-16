import {Listener, VorteEmbed} from "@vortekore/lib";
import {Message, TextChannel} from "discord.js";

export default class MessageUpdateListener extends Listener {
	public constructor() {
		super("message-updated", {
			event: "messageUpdate",
			emitter: "client"
		});
	}

	public async exec(old_msg: Message, new_msg: Message) {
		const guild = await this.client.findOrCreateGuild(old_msg.guild!.id);
		const {enabled, channel} = guild.log("messageUpdate", "audit");
		if (!channel || !enabled) return;

		const old_content = old_msg.cleanContent.toString().slice(0, 900);
		const new_content = new_msg.cleanContent.toString().slice(0, 900);

		const ch = old_msg.guild!.channels.resolve(channel) as TextChannel;
		if (!ch) return;

		return ch.send(
			new VorteEmbed(new_msg)
				.baseEmbed()
				.setTitle(`Event: Message Update`)
				.setDescription(
					[
						`**Channel**: ${new_msg.channel} (${new_msg.channel.id})`,
						`**Link**: ${new_msg.url}`,
						`**Author**: ${new_msg.author.tag} (${new_msg.author.id})`
					].join("\n")
				)
				.addField(`Old Message:`, old_content)
				.addField(`New Message`, new_content)
				.setTimestamp()
		);
	}
}
