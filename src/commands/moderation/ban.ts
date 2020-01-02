import { TextChannel } from "discord.js";
import { Command, VorteEmbed } from "@vortekore/lib";
import { GuildMember, Message } from "discord.js";

export default class extends Command {
  public constructor() {
    super("ban", {
      aliases: [ "ban" ],
      channel: "guild",
      description: {
        content: "Bans a member from the server",
        examples: ["v!ban @2D not cool"],
        usage: "<@member> [reason]"
      },
      userPermissions: ["BAN_MEMBERS"],
      clientPermissions: ["BAN_MEMBERS"],
      args: [
        {
          id: "member",
          prompt: {
            start: "Please provide a member to ban."
          },
          type: "member"
        },
        {
          id: "reason",
          prompt: {
            start: "Please provide a reason for this ban."
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
      return message.sem("You can't ban yourself", { type: "error" });
    if (message.member!.roles.highest <= member.roles.highest)
      return message.sem("The user has higher role than you.", {
        type: "error"
      });

    try {
      await member!.ban({ reason: reason });
      message.sem("Succesfully banned the user.");
    } catch (error) {
      this.logger.error(`ban command`, error);
      return message.sem(`Sorry, we ran into an error.`, { type: "error" });
    }

    const _case = await this.client.database.newCase(message.guild!.id, {
      type: "ban",
      subject: member.id,
      reason,
      moderator: message.author.id
    });

    if (!message._guild!.logs.channel || !message._guild!.logs.ban) return;

    const logChannel = member.guild.channels.get(
      message._guild!.logs.channel
    ) as TextChannel;
    logChannel.send(
      new VorteEmbed(message)
        .baseEmbed()
        .setTimestamp()
        .setAuthor(`Ban [Case ID: ${_case.id}] `)
        .setThumbnail(this.client.user.displayAvatarURL())
        .setDescription(
          [
            `**Staff**: ${message.author.tag} (${message.author.id})`,
            `**Banned**: ${member.user.tag} (${member.user.id})`,
            `**Reason**: ${reason}`
          ].join("\n")
        )
    );
  }
}
