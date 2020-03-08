import { CaseEntity, Command, confirm, VorteEmbed } from "../../../lib";
import { GuildMember, Message, TextChannel } from "discord.js";
import ms from "ms";

export default class extends Command {
  public constructor() {
    super("tempmute", {
      aliases: ["temp-mute"],
      description: t => t("cmds:mod.tm.desc"),
      userPermissions: ["MUTE_MEMBERS"],
      channel: "guild",
      args: [
        {
          id: "member",
          prompt: {
            start: (_: Message) => _.t("cmds:mod.memb", { action: "temp mute" })
          },
          type: "member"
        },
        {
          id: "duration",
          prompt: {
            start: (_: Message) => _.t("cmds:mod.mute.purp")
          },
          type: (_: Message, p: string) => (p ? ms(p) || null : null)
        },
        {
          id: "reason",
          default: "None given",
          match: "rest"
        },
        {
          id: "yes",
          match: "flag",
          flag: ["-y", "--yes", ":y"]
        }
      ]
    });
  }

  public async exec(
    message: Message,
    {
      member,
      duration,
      reason,
      yes
    }: { member: GuildMember; duration: number; reason: string; yes: boolean }
  ) {
    if (message.deletable) await message.delete();
    if (member.id === message.member.id)
      return message
        .sem(message.t("cmds:mod.tm.ursf"), {
          type: "error"
        })
        .then(m => m.delete({ timeout: 6000 }));

    const mh = member.roles.highest,
      uh = message.member.roles.highest;
    if (mh.position >= uh.position)
      return message
        .sem(message.t("cmds:mod.hier", { mh, uh }), { type: "error" })
        .then(m => m.delete({ timeout: 6000 }));

    if (!yes) {
      const confirmed = await confirm(
        message,
        message.t("cmds:mod.confirm", {
          member,
          reason,
          action: "temp mute"
        })
      );
      if (!confirmed)
        return message
          .sem("Okay, your choice!")
          .then(m => m.delete({ timeout: 6000 }));
    }

    let muteRole = message.guild.roles.resolve(message._guild.muteRole);
    try {
      if (!muteRole) {
        if (!yes) {
          const confirmed = await confirm(
            message,
            message.t("cmds:mod.mute.mtr_confirm")
          );
          if (!confirmed)
            return message
              .sem(message.t("cmds:mod.mute.create_mtr"))
              .then(m => m.delete({ timeout: 6000 }));
        }

        muteRole = (<any>this.client).guild_manager.createMuteRole(message);
      }

      await member.roles.add(muteRole, reason);
      message
        .sem(
          message.t("cmds:mod.done", { member, action: "Temp Muted", reason })
        )
        .then(m => m.delete({ timeout: 6000 }));
    } catch (error) {
      this.logger.error(error, "tempmute");
      return message
        .sem(message.t("cmds:mod.error", { member, action: "temp mute" }), {
          type: "error"
        })
        .then(m => m.delete({ timeout: 10000 }));
    }

    const _case = new CaseEntity(++message._guild.cases, member.guild.id);
    _case.reason = reason;
    _case.moderator = message.author.id;
    _case.subject = member.id;
    _case.type = "mute";
    _case.other = {
      finished: false,
      duration: duration + Date.now(),
      temp: true
    };

    await _case.save();
    await message._guild.save();

    const { channel, enabled } = message._guild.log("mute", "audit");
    if (!channel || !enabled) return;
    const logs = message.guild.channels.resolve(channel) as TextChannel;

    return logs.send(
      new VorteEmbed(message)
        .setAuthor(
          `Temp. Mute [ Case ID: ${_case.id} ]`,
          message.author.displayAvatarURL()
        )
        .setThumbnail(this.client.user.displayAvatarURL())
        .setDescription(
          [
            `**Staff Member**: ${message.author} \`(${message.author.id})\``,
            `**Victim**: ${member.user} \`(${member.id})\``,
            `**Reason**: ${reason}`,
            `**Duration**: ${ms(duration, { long: true })}`
          ].join("\n")
        )
    );
  }
}
