import { CaseEntity, Command, confirm, VorteEmbed } from "@vortekore/lib";
import { GuildMember, Message, TextChannel } from "discord.js";

export default class extends Command {
  public constructor() {
    super("ban", {
      aliases: ["ban"],
      channel: "guild",
      description: {
        content: "Bans a member from the server",
        examples: ["v!ban @2D not cool"],
        usage: "<@member> <reason>"
      },
      userPermissions: ["BAN_MEMBERS"],
      clientPermissions: ["BAN_MEMBERS"],
      args: [
        {
          id: "member",
          prompt: {
            start: "Please provide a member to ban."
          },
          type: "member"
        },
        {
          id: "reason",
          prompt: {
            start: "Please provide a reason for this ban."
          },
          match: "rest"
        }
      ]
    });
  }

  public async exec(
    message: Message,
    { member, reason }: { member: GuildMember; reason: string }
  ) {
    if (message.deletable) message.delete();
    if (member.id === message.member.id)
      return message
        .sem(
          "If you wanted to ban yourself just leave and never come back...",
          { type: "error" }
        )
        .then(m => m.delete({ timeout: 8000 }));

    const mh = member.roles.highest,
      uh = message.member.roles.highest;
    if (mh.position >= uh.position)
      return message
        .sem(
          `That person is ${
            mh.position === uh.position
              ? "in the same level as you"
              : "above you"
          } in the role hierarchy.`,
          {
            type: "error"
          }
        )
        .then(m => m.delete({ timeout: 8000 }));

    const confirmed = await confirm(
      message,
      `I need confirmation to ban **${member.user.tag}** \`(${member.id})\` for reason \`${reason}\``
    );
    if (!confirmed)
      return message
        .sem("Okay, your choice!")
        .then(m => m.delete({ timeout: 8000 }));

    try {
      await member.ban({ reason });
      message
        .sem(
          `Banned **${member.user.tag}** \`(${member.id})\` for reason \`${reason}\``
        )
        .then(m => m.delete({ timeout: 8000 }));
    } catch (error) {
      this.logger.error(error, "ban");
      return message
        .sem(
          `Oh no, I couldn't ban **${member.user.tag}**... contact the developers.`,
          { type: "error" }
        )
        .then(m => m.delete({ timeout: 10000 }));
    }

    const _case = new CaseEntity(++message._guild.cases, message.guild.id);
    _case.reason = reason;
    _case.moderator = message.author.id;
    _case.subject = member.id;
    _case.type = "ban";

    await _case.save();
    await message._guild.save();
    if (!message._guild.logs.channel || !message._guild.logs.ban) return;

    const logs = (await message.guild.channels.get(
      message._guild.logs.channel
    )) as TextChannel;

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