import { TextChannel } from "discord.js";
import { Command, VorteEmbed } from "@vortekore/lib";
import { GuildMember, Message } from "discord.js";

export default class extends Command {
  constructor() {
    super("warn", {
      description: {
        content: "Warns a member",
        usage: "<@member> [reason]",
        examples: ["v!warn @Johna3212#1708 not following rules"]
      },
      channel: "guild",
      aliases: [ "warn" ],
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
    const _case = await this.client.database.newCase(message.guild!.id, {
      type: "slowmode",
      subject: member.id,
      reason,
      moderator: message.author.id
    });

    ++message.profile!.warns;
    await message.profile!.save();
    if (!message._guild!.logs.channel || !message._guild!.logs.warn) return;

    const logChannel = message.guild!.channels.get(
      message._guild!.logs.channel
    ) as TextChannel;
    logChannel.send(
      new VorteEmbed(message)
        .baseEmbed()
        .setAuthor(`Warn [Case ID: ${_case.id}]`)
        .setThumbnail(this.client.user.displayAvatarURL())
        .setDescription(
          [
            `**Moderator**: ${message.author.tag} (${message.author.id})`,
            `**Warned**: ${member.user.tag} (${member.user.id})`,
            `**Reason**: ${reason}`
          ].join("\n")
        )
        .setTimestamp()
    );
  }
}
