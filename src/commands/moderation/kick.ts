import { TextChannel } from "discord.js";
import { Command, VorteEmbed } from "@vortekore/lib";
import { GuildMember, Message } from "discord.js";

export default class extends Command {
  constructor() {
    super("kick", {
      aliases: [ "kick" ],
      description: {
        content: "Kicks a member",
        examples: ["v!ban @2D mass pinging"],
        usage: "<member> [reason]"
      },
      userPermissions: ["KICK_MEMBERS"],
      channel: "guild",
      args: [
        {
          id: "member",
          prompt: {
            start: "Please provide a member to kick."
          },
          type: "member"
        },
        {
          id: "reason",
          prompt: {
            start: "Please provide a reason for this kick."
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
    if (message.deletable) await message.delete();

    if (message.author.id === member.user.id)
      return message.sem("You can't ban yourself");
    if (message.member!.roles.highest <= member.roles.highest)
      return message.sem("The user has higher role than you.");

    try {
      await member.kick(reason);
      message.sem("Succesfully kicked the member.");
    } catch (error) {
      this.logger.error(`kick command`, error);
      return message.sem(`Sorry, we ran into an error.`, { type: "error" });
    }

    const _case = await this.client.database.newCase(message.guild!.id, {
      type: "kick",
      subject: member.id,
      reason,
      moderator: message.author.id
    });

    if (!message._guild!.logs.channel || !message._guild!.logs.kick) return;

    const logChannel = member.guild.channels.get(
      message._guild!.logs.channel
    ) as TextChannel;
    logChannel.send(
      new VorteEmbed(message)
        .baseEmbed()
        .setTimestamp()
        .setAuthor(`Channel Lockdown (Case ID: ${_case.id})`)
        .setThumbnail(this.client.user.displayAvatarURL())
        .setDescription(
          [
            `**Staff**: ${message.author.tag} (${message.author.id})`,
            `**Kicked**: ${member.user.tag} (${member.user.id})`,
            `**Reason**: ${reason ? reason : "No reason"}`
          ].join("\n")
        )
    );
  }
}
