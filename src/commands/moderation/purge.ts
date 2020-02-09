import { Command, VorteEmbed, confirm, CaseEntity } from "@vortekore/lib";
import { TextChannel, Message } from "discord.js";

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
          prompt: {
            start: (_: Message) => _.t("cmds:mod.purp", { action: "purge" })
          }
        },
        {
          id: "ignorePinned",
          match: "flag",
          flag: ["--ignore-pinned", "-ip", ":ignore-pinned"]
        }
      ]
    });
  }

  public async exec(
    message: Message,
    {
      amount,
      reason,
      ignorePinned
    }: { amount: number; reason: string; ignorePinned: boolean }
  ) {
    if (message.deletable) await message.delete();

    let messages = await message.channel.messages.fetch({ limit: amount });
    if (ignorePinned) messages = messages.filter(c => !c.pinned);

    const confirmation = await confirm(
      message,
      message.t("cmds:mod.purge.confirm", { message, messages, reason })
    );

    if (!confirmation)
      return message
        .sem("Okay, I aborted the purge request.")
        .then(m => m.delete({ timeout: 6000 }));

    let deleted;
    try {
      deleted = (await message.channel.bulkDelete(messages, true)).size;
      message
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
    await message._guild.save();

    const { channel, enabled } = message._guild.log("purge", "audit");
    if (!channel || !enabled) return;
    const logs = (await message.guild.channels.get(channel)) as TextChannel;

    return logs.send(
      new VorteEmbed(message)
        .baseEmbed()
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
