import { GuildChannel, TextChannel, Message } from "discord.js";
import ms = require("ms");
import { Command, VorteEmbed } from "@vortekore/lib";
import { Argument } from "discord-akairo"

export default class extends Command {
  public constructor() {
    super("slowmode", {
      aliases: [ "slowmode" ],
      description: {
        usage: "<remove|release|rel|time> <reason>",
        examples: [ "v!slowmode remove", "v!slowmode 5s", "v!slowmode 3h raid" ]
      },
      channel: "guild",
      userPermissions: ["MANAGE_MESSAGES"],
      args: [
        {
          id: "time",
          prompt: {
            start: "Please provide a time or 'release'"
          },
          type: Argument.union(["remove", "release", "rel"], "number")
        },
        {
          id: "reason",
          prompt: {
            start: "Please provide a reason for enabling slowmode."
          },
          match: "rest"
        }
      ]
    });
  }

  public async exec(message: Message, { time, reason }: { time: string | number, reason: string }) {
    const chan = message.channel as GuildChannel;

    if (["remove", "release", "rel"].includes(String(time))) {
      message.sem("Succesffully removed the slowmode");
      return chan.edit({
        rateLimitPerUser: 0
      });
    } else {
      const sec = Number(time);

      chan.edit({
        rateLimitPerUser: sec
      });

      const _case = await this.client.database.newCase(message.guild!.id, {
        type: "slowmode",
        subject: chan.id,
        reason,
        amount: sec,
        moderator: message.author.id
      });

      if (!message._guild!.logs.channel || !message._guild!.logs.slowmode)
        return;

      const logChannel = message.guild!.channels.get(
        message._guild!.logs.channel
      ) as TextChannel;
      logChannel.send(
        new VorteEmbed(message)
          .baseEmbed()
          .setAuthor(`Slowmode (Case ID: ${_case.id})`)
          .setThumbnail(this.client.user.displayAvatarURL())
          .setDescription(
            [
              `**Moderator**: ${message.author.tag} (${message.author.id})`,
              `**Channel**: ${chan.name} (${chan.id})`,
              `**Reason**: ${reason}`,
              `**Cooldown**: ${ms(sec)}`
            ].join("\n")
          )
          .setTimestamp()
      );
    }
  }
}
