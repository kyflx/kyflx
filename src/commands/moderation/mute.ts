import { CaseEntity, Command, confirm, VorteEmbed } from "@vortekore/lib";
import { GuildMember, Message, TextChannel } from "discord.js";
import ms from "ms";

export default class extends Command {
  public constructor() {
    super("mute", {
      aliases: ["mute"],
      userPermissions: ["MUTE_MEMBERS"],
      channel: "guild",
      args: [
        {
          id: "member",
          prompt: {
            start: "Please provide a member to mute."
          },
          type: "member"
        },
        {
          id: "time",
          prompt: {
            start: "Please provide a mute time."
          },
          type: "string"
        },
        {
          id: "reason",
          prompt: {
            start: "Please provide a reason for this mute."
          },
          match: "rest"
        }
      ],
       description: {
         content: t => t("commands:mute.description")
       }
    });
  }

  public async exec(
    message: Message,
    {
      member,
      time,
      reason
    }: { member: GuildMember; time: string; reason: string }
  ) {
    if (message.deletable) message.delete();
    if (member.id === message.member.id)
      return message
        .sem("If you wanted to mute yourself just don't talk...", {
          type: "error"
        })
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

    const muteTime = ms(time);

    const confirmed = await confirm(
      message,
      `I need confirmation to mute **${member.user.tag}** \`(${
        member.id
      })\` for ${ms(muteTime, { long: true })} with reason \`${reason}\``
    );
    if (!confirmed)
      return message
        .sem("Okay, your choice!")
        .then(m => m.delete({ timeout: 8000 }));

    let muteRole = message.guild.roles.get(message._guild.muteRole);
    try {
      if (!muteRole) {
        const confirmed = await confirm(message, `Could I create a mute role?`);
        if (!confirmed)
          return message
            .sem(
              `Okay, use \`@${this.client.user.tag} muterole\` to set a mute role!`
            )
            .then(m => m.delete({ timeout: 8000 }));
        muteRole = await message.guild.roles.create({
          data: {
            name: "Muted",
            permissions: 0,
            color: "#1f1e1c"
          }
        });

        message._guild.muteRole = muteRole.id;
        for (const [, cg] of message.guild.channels.filter(
          c => c.type === "category"
        ))
          cg.createOverwrite(
            muteRole,
            {
              SEND_MESSAGES: false
            },
            "new mute role"
          );
      }

      await member.roles.add(muteRole, reason);
      message
        .sem(
          `Successfully muted **${member.user.tag}** \`(${member.id})\` with reason \`${reason}\``
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

    const _case = new CaseEntity(++message._guild.cases, member.guild.id);
    _case.reason = reason;
    _case.moderator = message.author.id;
    _case.subject = member.id;
    _case.type = "ban";
    _case.other = { finished: false, muteTime };

    await _case.save();
    await message._guild.save();

    const { channel, enabled } = message._guild.log("mute", "audit");
    if (!channel || !enabled) return;
    const logs = (await message.guild.channels.get(channel)) as TextChannel;

    return logs.send(
      new VorteEmbed(message)
        .baseEmbed()
        .setAuthor(
          `Mute [ Case ID: ${_case.id} ]`,
          message.author.displayAvatarURL()
        )
        .setThumbnail(this.client.user.displayAvatarURL())
        .setDescription(
          [
            `**Staff Member**: ${message.author} \`(${message.author.id})\``,
            `**Victim**: ${member.user} \`(${member.id})\``,
            `**Reason**: ${reason}`,
            `**Mute Time**: ${ms(muteTime, { long: true })}`
          ].join("\n")
        )
    );
  }
}
