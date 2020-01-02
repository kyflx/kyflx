import { GuildChannel, TextChannel, Message } from "discord.js";
import ms = require("ms");
import { Command, VorteEmbed } from "@vortekore/lib";

export default class extends Command {
  public constructor() {
    super("lockdown", {
      aliases: ["lockdown", "ld"],
      description: {
        content: "Lockdowns a channel",
        examples: ["v!lockdown 10m time to sleep"],
        usage: "<duration> [reason]"
      },
      userPermissions: ["MANAGE_CHANNELS"],
      clientPermissions: ["MANAGE_CHANNELS"],
      channel: "guild",
      args: [
        {
          id: "time",
          prompt: {
            start: "Please provide a time or 'unlock'"
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
    { time, reason }: { time: string; reason: string }
  ) {
    const chan = message.channel as GuildChannel;

    if (["release", "unlock", "remove"].includes(time)) {
      chan.overwritePermissions({
        permissionOverwrites: [
          {
            id: message.guild!.id,
            allow: ["SEND_MESSAGES"]
          }
        ]
      });
    } else {
      const msTime = ms(time);
      if (!msTime) return message.sem("Unable to resolve the time");

      await chan.overwritePermissions({
        permissionOverwrites: [
          {
            id: message.guild!.id,
            deny: ["SEND_MESSAGES"]
          }
        ],
        reason: reason ? reason : `No reason provided - ${message.author.tag}`
      });
      setTimeout(() => {
        chan.overwritePermissions({
          permissionOverwrites: [
            {
              id: message.guild!.id,
              allow: ["SEND_MESSAGES"]
            }
          ],
          reason: reason ? reason : `No reason provided - ${message.author.tag}`
        });
        message.sem("Successfully unlocked the channel.");
      }, msTime);

      const _case = await this.client.database.newCase(message.guild!.id, {
        type: "lockdown",
        subject: chan.id,
        reason,
        moderator: message.author.id
      });

      if (!message._guild!.logs.channel || !message._guild!.logs.lockdown)
        return;

      const logChannel = message.guild!.channels.get(
        message._guild!.logs.channel
      ) as TextChannel;
      logChannel.send(
        new VorteEmbed(message)
          .baseEmbed()
          .setAuthor(`Channel Lockdown (Case ID: ${_case.id})`)
          .setThumbnail(this.client.user.displayAvatarURL())
          .setDescription(
            [
              `**Staff**: ${message.author.tag} (${message.author.id})`,
              `**Channel**: ${chan} (${chan.id})`,
              `**Reason**: ${
                reason === undefined ? `No reason provided` : reason
              }`
            ].join("\n")
          )
      );
    }
  }
}
