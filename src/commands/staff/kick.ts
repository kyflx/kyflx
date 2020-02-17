import {CaseEntity, Command, confirm, VorteEmbed} from "@vortekore/lib";
import {GuildMember, Message, TextChannel} from "discord.js";

export default class extends Command {
	public constructor() {
		super("kick", {
			aliases: ["kick"],
			channel: "guild",
			description: t => t("cmds:mod.kick.desc"),
			userPermissions: "KICK_MEMBERS",
			clientPermissions: "KICK_MEMBERS",
			args: [
				{
					id: "member",
					prompt: {
						start: (_: Message) => _.t("cmds:mod.memb", {action: "kick"})
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
				.sem(message.t("cmds:mod.kick.ursf"), {type: "error"})
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
			message.t("cmds:mod.confirm", {member, reason, action: "kick"})
		);
		if (!confirmed)
			return message
				.sem(message.t("cmds:mod.canc"))
				.then(m => m.delete({timeout: 6000}));

		try {
			await member.kick(reason);
			message
				.sem(
					message.t("cmds:mod.done", {
						member,
						action: "Kicked",
						reason
					})
				)
				.then(m => m.delete({timeout: 6000}));
		} catch (error) {
			this.logger.error(error, "kick");
			return message
				.sem(message.t("cmds:mod.error", {member, action: "kick"}), {
					type: "error"
				})
				.then(m => m.delete({timeout: 10000}));
		}

		const _case = new CaseEntity(++message._guild.cases, message.guild.id);
		_case.reason = reason;
		_case.moderator = message.author.id;
		_case.subject = member.id;
		_case.type = "kick";

		await _case.save();
		await message._guild.save();

		const {channel, enabled} = message._guild.log("kick", "audit");
		if (!channel || !enabled) return;
		const logs = (await message.guild.channels.resolve(channel)) as TextChannel;

		return logs.send(
			new VorteEmbed(message)
				.baseEmbed()
				.setAuthor(
					`Kick [ Case ID: ${_case.id} ]`,
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
