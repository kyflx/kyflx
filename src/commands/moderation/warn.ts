import { Command, VorteEmbed, confirm, CaseEntity } from "@vortekore/lib";
import { GuildMember, Message, TextChannel } from "discord.js";

export default class extends Command {
  constructor() {
    super("warn", {
      description: {
        content: "Warns a member",
        usage: "<@member> <reason>",
        examples: ["v!warn @2D#5773 not following rules"]
      },
      channel: "guild",
      aliases: ["warn"],
      userPermissions: ["MANAGE_GUILD"],
      args: [
        {
          id: "member",
          prompt: {
            start: "Please provide a member to warn."
          },
          type: "member"
        },
        {
          id: "reason",
          prompt: {
            start: "Please provide a reason for this warn."
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
        .sem("C'mon man you can't warn yourself...", { type: "error" })
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
      `I need confirmation to warn **${member.user.tag}** \`(${member.id})\` with the reason \`${reason}\``
    );
    if (!confirmed)
      return message
        .sem("Okay, your choice!")
        .then(m => m.delete({ timeout: 8000 }));

    const profile = await this.client.findOrCreateProfile(
      member.id,
      member.guild.id
    );
    ++profile.warns;

    message
      .sem(
        `Warned **${member.user.tag}** \`(${member.id})\` for reason \`${reason}\`. They now have \`${profile.warns}\` warns`
      )
      .then(m => m.delete({ timeout: 8000 }));

    const _case = new CaseEntity(++message._guild.cases, message.guild.id);
    _case.reason = reason;
    _case.moderator = message.author.id;
    _case.subject = member.id;
    _case.type = "warn";

    await profile.save();
    await _case.save();
    await message._guild.save();

    const { channel, enabled } = message._guild.log("warn", "audit");
    if (!channel || !enabled) return;
    const logs = (await message.guild.channels.get(channel)) as TextChannel;

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
