import { GuildMember, Message, TextChannel } from "discord.js";
import ms = require("ms");
import { CaseEntity, Command, confirm, VorteEmbed } from "../../../lib";

export default class TempBanCommand extends Command {
  public constructor() {
    super("tempban", {
      aliases: ["temp-ban", "tb"],
      description: t => t("cmds:mod.tb.desc"),
      channel: "guild",
      args: [
        {
          id: "member",
          prompt: {
            start: (_: Message) => _.t("cmds:mod.memb", { action: "temp ban" })
          },
          type: "member"
        },
        {
          id: "duration",
          type: (_: Message, p: string) => (p ? ms(p) || null : null),
          prompt: {
            start: (_: Message) => _.t("cmds:mod.tb.dur")
          }
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
      reason = "",
      yes
    }: { member: GuildMember; duration: number; reason: string; yes: boolean }
  ) {
    if (message.deletable) await message.delete();
    if (member.id === message.member.id)
      return message
        .sem(message.t("cmds:mod.tb.ursf"), { type: "error" })
        .then(m => m.delete({ timeout: 6000 }));
    const mh = member.roles.highest,
      uh = message.member.roles.highest;
    if (mh.position >= uh.position)
      return message
        .sem(message.t("cmds:mod.hier", { mh, uh }), {
          type: "error"
        })
        .then(m => m.delete({ timeout: 6000 }));

    if (!yes) {
      const confirmed = await confirm(
        message,
        message.t("cmds:mod.confirm", { member, reason, action: "temp ban" })
      );
      if (!confirmed)
        return message
          .sem(message.t("cmds:mod.canc"))
          .then(m => m.delete({ timeout: 6000 }));
    }

    try {
      await member.ban({ reason });
      await message
        .sem(
          message.t("cmds:mod.done", {
            member,
            action: "Temp Banned",
            reason
          })
        )
        .then(m => m.delete({ timeout: 6000 }));
    } catch (error) {
      this.logger.error(error, "Tempban");
      return message
        .sem(message.t("cmds:mod.error", { member, action: "temp ban" }), {
          type: "error"
        })
        .then(m => m.delete({ timeout: 10000 }));
    }

    const _case = new CaseEntity(++message._guild.cases, message.guild.id);
    _case.reason = reason;
    _case.moderator = message.author.id;
    _case.subject = member.id;
    _case.type = "ban";
    _case.other = {
      finished: false,
      temp: true,
      duration: duration + Date.now()
    };

    await _case.save();
    await this.updateDb(message.guild, "cases", message._guild.cases);

    const { channel, enabled } = this.log(message._guild, "ban", "audit");
    if (!channel || !enabled) return;
    const logs = message.guild.channels.resolve(channel) as TextChannel;

    return logs.send(
      new VorteEmbed(message)
        .setAuthor(
          `Temp Ban [ Case ID: ${_case.id} ]`,
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
