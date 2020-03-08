import { Command, paginate, ProfileEntity, VorteEmbed } from "../../../lib";
import { Message } from "discord.js";

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
        }, {
          id: "mobile",
          match: "flag",
          flag: ["-m", ":m", "--mobile"]
        }
      ]
    });
  }

  public async exec(message: Message, { page: selected, mobile }: { page: number, mobile: boolean }) {
    let members = await ProfileEntity.find({ guildId: message.guild!.id });
    if (!members.length) return message.sem(message.t("commands:eco.lb.emp"));

    members = members
      .filter(p => message.guild.members.resolve(p.userId))
      .sort((a, b) => b.xp - a.xp);

    let { items, page, maxPage } = paginate(members, selected),
      index = (page - 1) * 10;

    if (mobile) {
      const leaderboardEmbed = new VorteEmbed(message)
        .setAuthor("Leaderboard", message.author.displayAvatarURL())
        .setDescription(items.map(p => `\`#${(++index).toString().padStart(2, "0")}\` <@${p.userId}>\n- **Level:** ${p.level}`).join("\n\n"));
      return message.util.send(leaderboardEmbed)
    }

    const leaderboardEmbed = new VorteEmbed(message)
      .setAuthor("Leaderboard", message.author.displayAvatarURL())
      .setDescription(`*TIP: for mobile you can do \`${message.util.parsed.prefix}lb -m\` to make it easier on your eyes*`)
      .addField("Member", items.map(p => `\`#${(++index).toString().padStart(2, "0")}\` <@${p.userId}>`), true)
      .addField("\u200b", items.map(p => `**Level** ${p.level}`), true)
      .setFooter(maxPage === page ? "VorteKore" : `Page #${page} / ${maxPage}`)
    return message.util.send(leaderboardEmbed);
  }
}
