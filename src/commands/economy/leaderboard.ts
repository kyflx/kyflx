import {Command, paginate, ProfileEntity, VorteEmbed} from "@vortekore/lib";
import {Message} from "discord.js";

export default class extends Command {
	public constructor() {
		super("leaderboard", {
			aliases: ["leaderboard", "lb"],
			description: t => t("cmds:eco.lb.desc"),
			args: [
				{
					id: "page",
					default: 1,
					type: "number"
				}
			]
		});
	}

	public async exec(message: Message, {page: selected}: { page: number }) {
		let members = await ProfileEntity.find({guildId: message.guild!.id});
		if (!members.length) return message.sem(message.t("commands:eco.lb.emp"));
		members = members
			.filter(({userId}) => message.guild.members.resolve(userId))
			.sort((a, b) => b.xp - a.xp);

		let {items, page, maxPage} = paginate(members, selected),
			index = (page - 1) * 10,
			str = items
				.map(({userId, level}) => {
					const user = message.guild.member(userId);
					return `**${++index}.**  ${user ? user : "Unknown"} - Level ${level}`;
				})
				.join("\n");

		const leaderboardEmbed = new VorteEmbed(message)
			.baseEmbed()
			.setAuthor("Leaderboard", message.author.displayAvatarURL())
			.setDescription(`${str}\nPage #${page} / ${maxPage}`);
		return message.util.send(leaderboardEmbed);
	}
}
