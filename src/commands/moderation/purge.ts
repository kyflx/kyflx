import { Command, VorteEmbed } from "@vortekore/lib";
import { TextChannel, Message } from "discord.js";

export default class extends Command {
  public constructor() {
    super("purge", {
      aliases: [ "purge", "clear" ],
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
          flag: "--ignore-pinned",
          default: true
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
    if (message.deletable) message.delete();
    const messages = (await message.channel.messages.fetch({
      limit: amount
    })).filter(m => ignorePinned ? !m.pinned : true);

    const deleted = await message.channel.bulkDelete(await messages, true);
    message.sem(`Successfully purged **${deleted.size}** messages!`);

    const _case = await this.client.database.newCase(message.guild!.id, {
      type: "kick",
      subject: message.channel.id,
      reason,
      moderator: message.author.id
    });

    if (!message._guild!.logs.channel || !message._guild!.logs.kick) return;

    const logChannel = message.guild.channels.get(
      message._guild!.logs.channel
    ) as TextChannel;
    logChannel.send(
      new VorteEmbed(message)
        .baseEmbed()
        .setTimestamp()
        .setAuthor(`Purge (Case ID: ${_case.id})`)
        .setThumbnail(this.client.user.displayAvatarURL())
        .setDescription(
          [
            `**Staff**: ${message.author.tag} (${message.author.id})`,
            `**Channel**: ${message.channel} (${message.channel.id})`,
            `**Amount**: ${deleted.size} \`(${amount} intended)\``,
            `**Reason**: ${reason ? reason : "No reason"}`
          ].join("\n")
        )
    );
  }
}
