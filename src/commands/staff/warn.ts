import {CaseEntity, Command, confirm, VorteEmbed} from "@vortekore/lib";
import {GuildMember, Message, TextChannel} from "discord.js";

export default class extends Command {
	constructor() {
		super("warn", {
			description: t => t("cmds:mod.warn.desc"),
			channel: "guild",
			aliases: ["warn"],
			userPermissions: ["MANAGE_GUILD"],
			args: [
				{
					id: "member",
					prompt: {
						start: (_: Message) => _.t("cmds:mod.memb", {action: "warn"})
					},
					type: "member"
				},
				{
					id: "reason",
					default: "None given",
					match: "rest"
				}
			]
		});
	}

	public async exec(
		message: Message,
		{member, reason}: { member: GuildMember; reason: string }
	) {
		if (message.deletable) await message.delete();
		if (member.id === message.member.id)
			return message
				.sem(message.t("cmds:mod.warn.ursf"), {type: "error"})
				.then(m => m.delete({timeout: 6000}));

		const mh = member.roles.highest,
			uh = message.member.roles.highest;
		if (mh.position >= uh.position)
			return message
				.sem(message.t("cmds:mod.hier", {mh, uh}), {
					type: "error"
				})
				.then(m => m.delete({timeout: 6000}));

		const confirmed = await confirm(
			message,
			message.t("cmds:mod.confirm", {member, reason, action: "ban"})
		);
		if (!confirmed)
			return message
				.sem(message.t("cmds:mod.canc"))
				.then(m => m.delete({timeout: 6000}));

		const profile = await this.client.findOrCreateProfile(
			member.id,
			member.guild.id
		);
		++profile.warns;

		message
			.sem(message.t("cmds:mod.done", {member, reason, action: "Warned"}))
			.then(m => m.delete({timeout: 6000}));

		const _case = new CaseEntity(++message._guild.cases, message.guild.id);
		_case.reason = reason;
		_case.moderator = message.author.id;
		_case.subject = member.id;
		_case.type = "warn";

		await profile.save();
		await _case.save();
		await message._guild.save();

		const {channel, enabled} = message._guild.log("warn", "audit");
		if (!channel || !enabled) return;
		const logs = message.guild.channels.resolve(channel) as TextChannel;

		return logs.send(
			new VorteEmbed(message)
				.baseEmbed()
				.setAuthor(
					`Warn [ Case ID: ${_case.id} ]`,
					message.author.displayAvatarURL()
				)
				.setThumbnail(this.client.user.displayAvatarURL())
				.setDescription(
					[
						`**Staff Member**: ${message.author} \`(${message.author.id})\``,
						`**Victim**: ${member.user} \`(${member.id})\``,
						`**Reason**: ${reason}`
					].join("\n")
				)
		);
	}
}
