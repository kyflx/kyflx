import { GuildMember, Message, Role, TextChannel } from "discord.js";
import { CaseEntity, Command, KyflxEmbed } from "../../../lib";

export default class AddRoleCommand extends Command {
  public constructor() {
    super("add-role", {
      aliases: ["add-role", "ar"],
      channel: "guild",
      description: t => t("cmds:mod.ar.desc"),
      args: [
        {
          id: "role",
          type: "role",
          prompt: {
            start: (_: Message) => _.t("cmds:mod.ar.role")
          }
        },
        {
          id: "member",
          type: "member",
          prompt: {
            start: (_: Message) =>
              _.t("cmds:mod.memb", { action: "add a role to" })
          }
        },
        {
          id: "reason",
          default: "None given",
          match: "rest"
        }
      ]
    });
  }

  public async exec(
    message: Message,
    {
      member,
      role,
      reason
    }: { member: GuildMember; role: Role; reason: string }
  ) {
    if (message.deletable) await message.delete();

    const mh = member.roles.highest,
      uh = message.member.roles.highest;
    if (mh.position >= uh.position)
      return message
        .sem(message.t("cmds:mod.hier", { mh, uh }), {
          type: "error"
        })
        .then(m => m.delete({ timeout: 6000 }));

    try {
      await member.roles.add(role);
      await message
        .sem(
          message.t("cmds:mod.ar.done", {
            role,
            member,
            reason,
            action: "Added"
          })
        )
        .then(m => m.delete({ timeout: 6000 }));
    } catch (error) {
      this.logger.error(error, "ban");
      return message
        .sem(message.t("cmds:mod.ar.error", { role, member }), {
          type: "error"
        })
        .then(m => m.delete({ timeout: 10000 }));
    }

    const _case = new CaseEntity(++message._guild.cases, member.guild.id);
    _case.reason = reason;
    _case.moderator = message.author.id;
    _case.subject = member.id;
    _case.type = "roleAdd";

    await _case.save();
    await this.updateDb(message.guild, "cases", message._guild.cases);

    const { channel, enabled } = this.log(message._guild, "mute", "audit");
    if (!channel || !enabled) return;
    const logs = message.guild.channels.resolve(channel) as TextChannel;

    return logs.send(
      new KyflxEmbed(message)
        .setAuthor(
          `Role Add [ Case ID: ${_case.id} ]`,
          message.author.displayAvatarURL()
        )
        .setThumbnail(this.client.user.displayAvatarURL())
        .setDescription(
          [
            `**Staff Member**: ${message.author} \`(${message.author.id})\``,
            `**Victim**: ${member.user} \`(${member.id})\``,
            `**Reason**: ${reason}`,
            `**Role:** ${role} \`(${role.id})\``
          ].join("\n")
        )
    );
  }
}
