import { Command, VorteEmbed } from "@vortekore/lib";
import { GuildMember, Message } from "discord.js";

const Presence = {
  dnd: "Do Not Disturb",
  online: "Online",
  idle: "Idling",
  offline: "Offline"
};

export default class extends Command {
  public constructor() {
    super("userinfo", {
      aliases: ["userinfo", "whois", "ui"],
      description: {
        content: "Shows info on a member",
        usage: "[@member]",
        examples: ["v!ui 396096412116320258", "v!ui", "v!ui @2D#5773"]
      },
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
    const infoEmbed = new VorteEmbed(message)
      .baseEmbed()
      .setDescription(
        [
          `**Name**: ${member.user.tag} (${member.id})`,
          `**Joined At**: ${member.joinedAt!.toLocaleDateString()}`,
          `**Created At**: ${member.user.createdAt.toLocaleDateString()}`,
          `**Status**: ${Presence[member.presence.status]}`,
          `**Game**: ${
            member.presence!.activities.length
              ? member.presence!.activities[0].name
              : "None"
          }`,
          `**Roles**: ${member.roles
            .sorted((a, b) => b.position - a.position)
            .filter(r => r.name !== "@everyone")
            .map(r => r)
            .join(" ")}`
        ].join("\n")
      )
      .setThumbnail(member.user.displayAvatarURL({ size: 2048 }));
    message.util.send(infoEmbed);
  }
}
