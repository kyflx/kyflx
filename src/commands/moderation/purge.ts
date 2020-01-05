import { Command, VorteEmbed, confirm, CaseEntity } from "@vortekore/lib";
import { TextChannel, Message } from "discord.js";

export default class extends Command {
  public constructor() {
    super("purge", {
      aliases: ["purge", "clear"],
      description: {
        content: "Purge a number of messages",
        examples: ["v!purge 20 @2D"],
        usage: "<amount> [member]"
      },
      userPermissions: ["MANAGE_MESSAGES"],
      channel: "guild",
      args: [
        {
          id: "amount",
          type: "number",
          prompt: {
            start: "Please provide an amount to purge"
          }
        },
        {
          id: "reason",
          match: "rest",
          prompt: {
            start: "Please provice a reason to purge,"
          }
        },
        {
          id: "ignorePinned",
          match: "flag",
          flag: "--ignore-pinned"
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
      `I need confirmation to purge **${messages.size.toLocaleString()}** messages in channel ${
        message.channel
      } \`(${message.channel.id})\` with reason \`${reason}\``
    );

    if (!confirmation)
      return message
        .sem("Okay, I aborted the purge request.")
        .then(m => m.delete({ timeout: 8000 }));

    let deleted;
    try {
      deleted = await message.channel.bulkDelete(messages, true);
      message
        .sem(
          `Deleted **${deleted}** messages in channel ${message.channel} \`(${message.channel.id})\` with reason \`${reason}\``
        )
        .then(m => m.delete({ timeout: 8000 }));
    } catch (error) {
      this.logger.error(error, "purge");
      return message
        .sem(
          "Sorry, I couldn't purge any messages... contact the developers to see what happened",
          { type: "error" }
        )
        .then(m => m.delete({ timeout: 8000 }));
    }

    const _case = new CaseEntity(++message._guild.cases, message.guild.id);
    _case.subject = message.channel.id;
    _case.moderator = message.author.id;
    _case.reason = reason;
    _case.type = "purge";
    _case.other = { amount, deleted };

    await _case.save();
    await message._guild.save();
    if (!message._guild.logs.channel || !message._guild.logs.purge) return;

    const logs = (await message.guild.channels.get(
      message._guild.logs.channel
    )) as TextChannel;

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
            `**Deleted**: ${deleted} \`(${amount} intended)\``
          ].join("\n")
        )
    );
  }
}
