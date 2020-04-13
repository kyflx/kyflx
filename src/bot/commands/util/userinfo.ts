import { GuildMember, Message } from "discord.js";
import { Command, presences, KyflxEmbed } from "../../../lib";

export default class UserInfoCommand extends Command {
  public constructor() {
    super("user-info", {
      aliases: ["user-info", "whois", "ui"],
      description: t => t("cmds:util.ui.desc"),
      channel: "guild",
      args: [
        {
          id: "member",
          type: "member",
          default: (message: Message) => message.member
        }
      ]
    });
  }

  public async exec(message: Message, { member }: { member: GuildMember }) {
    const infoEmbed = new KyflxEmbed(message)
      .setDescription(
        [
          `**Name**: ${member.user.tag} (${member.id})`,
          `**Joined At**: ${member.joinedAt.toLocaleDateString()}`,
          `**Created At**: ${member.user.createdAt.toLocaleDateString()}`,
          `**Status**: ${presences[member.presence.status]}`,
          `**Game**: ${
            member.presence.activities.length
              ? member.presence.activities[0].name
              : "None"
          }`,
          `**Roles**: ${member.roles.cache
            .sorted((a, b) => b.position - a.position)
            .filter(r => r.name !== "@everyone")
            .map(r => r)
            .join(" ")}`
        ].join("\n")
      )
      .setThumbnail(member.user.displayAvatarURL({ size: 2048 }));
    return message.util.send(infoEmbed);
  }
}
