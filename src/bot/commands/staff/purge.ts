import { Message, TextChannel } from "discord.js";
import { CaseEntity, Command, confirm, KyflxEmbed } from "../../../lib";

export default class extends Command {
  public constructor() {
    super("purge", {
      aliases: ["purge", "clear"],
      description: t => t("cmds:mod.purge.desc"),
      userPermissions: "MANAGE_MESSAGES",
      clientPermissions: "MANAGE_MESSAGES",
      channel: "guild",
      args: [
        {
          id: "amount",
          type: "number",
          prompt: {
            start: (_: Message) => _.t("cmds:mod.purge.purp")
          }
        },
        {
          id: "reason",
          match: "rest",
          default: "None given"
        },
        {
          id: "deletePinned",
          match: "flag",
          flag: ["--delete-pinned", "-dp", ":delete-pinned"]
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
      amount,
      reason,
      deletePinned,
      yes
    }: { amount: number; reason: string; deletePinned: boolean; yes: boolean }
  ) {
    if (message.deletable) await message.delete();

    let messages = await message.channel.messages.fetch({ limit: amount });
    if (!deletePinned) messages = messages.filter(c => !c.pinned);

    if (!yes) {
      const confirmation = await confirm(
        message,
        message.t("cmds:mod.purge.confirm", { message, messages, reason })
      );

      if (!confirmation)
        return message
          .sem("Okay, I aborted the purge request.")
          .then(m => m.delete({ timeout: 6000 }));
    }

    let deleted;
    try {
      deleted = (await message.channel.bulkDelete(messages, true)).size;
      await message
        .sem(message.t("cmds:mod.purge.done", { message, deleted, reason }))
        .then(m => m.delete({ timeout: 6000 }));
    } catch (error) {
      this.logger.error(error, "purge");
      return message
        .sem(message.t("cmds:mod.purge.error"), { type: "error" })
        .then(m => m.delete({ timeout: 6000 }));
    }

    const _case = new CaseEntity(++message._guild.cases, message.guild.id);
    _case.subject = message.channel.id;
    _case.moderator = message.author.id;
    _case.reason = reason;
    _case.type = "purge";
    _case.other = { amount, deleted };

    await _case.save();
    await this.updateDb(message.guild, "cases", message._guild.cases);

    const { channel, enabled } = this.log(message._guild, "purge", "audit");
    if (!channel || !enabled) return;
    const logs = message.guild.channels.resolve(channel) as TextChannel;

    return logs.send(
      new KyflxEmbed(message)
        .setAuthor(
          `Purge [ Case ID: ${_case.id} ]`,
          message.author.displayAvatarURL()
        )
        .setThumbnail(this.client.user.displayAvatarURL())
        .setDescription(
          [
            `**Staff Member**: ${message.author} \`(${message.author.id})\``,
            `**Channel**: ${message.channel} \`(${message.channel.id})\``,
            `**Reason**: ${reason}`,
            `**Deleted**: ${deleted} ${
              deleted < amount ? `\`(${amount} intended)\`` : ""
            }`
          ].join("\n")
        )
    );
  }
}
