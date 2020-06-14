import { Message } from "discord.js";
import { Command } from "klasa";
import { GuildCommand } from "../../../lib";

@GuildCommand()
export default class JoinCommand extends Command {
  public async run(message: Message) {
    if (message.player) return message.reply(message.t("music.join.alr"));

    const channel = message.member.voice.channel;
    if (!channel) return message.reply(message.t("music.join.jvc"));
    if (!channel.permissionsFor(message.guild.me).has([ "SPEAK", "CONNECT" ]))
      return message.reply(message.t("music.join.perms"));

    await this.client.music.join(
      { channel: channel.id, guild: message.guild.id },
      { deaf: true }
    );

    return message.reply(message.t("music.join.summoned"));
  }
}
