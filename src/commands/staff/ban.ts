import {CaseEntity, Command, confirm, VorteEmbed} from "@vortekore/lib";
import {GuildMember, Message, TextChannel} from "discord.js";

export default class extends Command {
	public constructor() {
		super("ban", {
			aliases: ["ban"],
			channel: "guild",
			description: t => t("cmds:mod.ban.desc"),
			userPermissions: ["BAN_MEMBERS"],
			clientPermissions: ["BAN_MEMBERS"],
			args: [
				{
					id: "member",
					prompt: {
						start: (_: Message) => _.t("cmds:mod.memb", {action: "ban"})
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
				.sem(message.t("cmds:mod.ban.ursf"), {type: "error"})
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

		try {
			await member.ban({reason});
			message
				.sem(
					message.t("cmds:mod.done", {
						member,
						action: "Banned",
						reason
					})
				)
				.then(m => m.delete({timeout: 6000}));
		} catch (error) {
			this.logger.error(error, "ban");
			return message
				.sem(message.t("cmds:mod.error", {member, action: "ban"}), {
					type: "error"
				})
				.then(m => m.delete({timeout: 10000}));
		}

		const _case = new CaseEntity(++message._guild.cases, message.guild.id);
		_case.reason = reason;
		_case.moderator = message.author.id;
		_case.subject = member.id;
		_case.type = "ban";

		await _case.save();
		await message._guild.save();

		const {channel, enabled} = message._guild.log("ban", "audit");
		if (!channel || !enabled) return;
		const logs = message.guild.channels.resolve(channel) as TextChannel;

		return logs.send(
			new VorteEmbed(message)
				.baseEmbed()
				.setAuthor(
					`Ban [ Case ID: ${_case.id} ]`,
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
