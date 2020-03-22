import { GuildMember, Message, TextChannel } from "discord.js";
import { Command, confirm, VorteEmbed } from "../../../lib";

export default class UnmuteCommand extends Command {
  public constructor() {
    super("unmute", {
      aliases: ["unmute"],
      description: t => t("cmds:mod.um.desc"),
      channel: "guild",
      args: [
        {
          id: "member",
          prompt: {
            start: (_: Message) => _.t("cmds:mod.memb", { action: "unmute" })
          },
          type: "member"
        },
        {
          id: "reason",
          default: "None given.",
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
      reason,
      yes
    }: { member: GuildMember; reason: string; yes: boolean }
  ) {
    if (message.deletable) await message.delete();
    if (member.id === message.member.id)
      return message
        .sem(message.t("cmds:mod.um.ursf"), { type: "error" })
        .then(m => m.delete({ timeout: 6000 }));
    const mh = member.roles.highest,
      uh = message.member.roles.highest;
    if (mh.position >= uh.position)
      return message
        .sem(message.t("cmds:mod.hier", { mh, uh }), {
          type: "error"
        })
        .then(m => m.delete({ timeout: 6000 }));

    if (!member.roles.cache.has(message._guild.muteRole))
      return message.sem(message.t("cmds:mod.un.not", { member }));

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
      if (!message._guild.muteRole)
        return message.sem(message.t("cmds:mod.un.mtr"));

      await member.roles.remove(message._guild.muteRole, "unmute");
      await message.sem(
        message.t("cmds:mod.done", {
          member,
          action: "Unmuted",
          reason
        })
      );
    } catch (error) {
      this.logger.error(error, "Unmute");
      return message.sem(
        message.t("cmds:mod.error", { member, action: "unmute" })
      );
    }

    // const _case = new CaseEntity(++message._guild.cases, message.guild.id);
    // _case.reason = reason;
    // _case.moderator = message.author.id;
    // _case.subject = member.id;
    // _case.type = "";

    const { channel, enabled } = this.log(message._guild, "mute", "audit");
    if (!channel || !enabled) return;
    const logs = message.guild.channels.resolve(channel) as TextChannel;

    return logs.send(
      new VorteEmbed(message)
        .setAuthor(`Unmute`, message.author.displayAvatarURL())
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
