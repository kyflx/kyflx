import { TextChannel } from "discord.js";
import ms from "ms";
import { Command, VorteEmbed } from "@vortekore/lib";
import { GuildMember, Message } from "discord.js";

export default class extends Command {
  public constructor() {
    super("mute", {
      aliases: [ "mute" ],
      description: {
        content: "Mutes a member",
        usage: "<member> <duration>",
        examples: ["!mute @user 10m"]
      },
      userPermissions: ["MUTE_MEMBERS"],
      channel: "guild",
      args: [
        {
          id: "member",
          prompt: {
            start: "Please provide a member to mute."
          },
          type: "member"
        },
        {
          id: "time",
          prompt: {
            start: "Please provide a mute time."
          },
          type: "string"
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
    {
      member,
      time,
      reason
    }: { member: GuildMember; time: string; reason: string }
  ) {
    if (message.deletable) await message.delete();

    const msTime = ms(time);
    if (!msTime) return message.sem("Please provide a valid time");

    const muteRole =
      message.guild!.roles.find(x => x.name.toLowerCase() === "muted") ||
      (await message.guild!.roles.create({
        data: {
          name: "Muted",
          color: "#1f1e1c"
        }
      }));

    try {
      await member.roles.add(muteRole);
      message.sem("Successfully muted that member.");
    } catch (error) {
      console.error(`mute command`, error);
      return message.sem(
        `Sorry, I ran into an error. Please contact the developers too see if they can help!`
      );
    }

    const _case = await this.client.database.newCase(message.guild!.id, {
      type: "mute",
      subject: member.id,
      reason,
      amount: msTime,
      moderator: message.author.id
    });

    if (!message._guild!.logs.channel || !message._guild!.logs.mute) return;

    const logChannel = member.guild.channels.get(
      message._guild!.logs.channel
    ) as TextChannel;
    logChannel.send(
      new VorteEmbed(message)
        .baseEmbed()
        .setAuthor(`Mute [Case ID: ${_case.id}]`)
        .setThumbnail(this.client.user.displayAvatarURL())
        .setDescription(
          [
            `**Staff**: ${message.author.tag} (${message.author.id})`,
            `**Muted**: ${member.user.tag}`,
            `**Time**: ${time}`,
            `**Reason**: ${reason}`
          ].join("\n")
        )
        .setTimestamp()
    );
  }
}
