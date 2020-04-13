import { Message, TextChannel } from "discord.js";
import { Listener, log, KyflxEmbed } from "../../../lib";

export default class MessageUpdateListener extends Listener {
  public constructor() {
    super("message-updated", {
      event: "messageUpdate",
      emitter: "client"
    });
  }

  public async exec(oldMsg: Message, newMsg: Message) {
    if (!oldMsg.guild) return;

    const guild = this.client.ensureGuild(oldMsg.guild.id);
    const { enabled, channel } = log(guild, "messageUpdate", "audit");
    if (!channel || !enabled) return;

    const oldContent = oldMsg.cleanContent.toString().slice(0, 900);
    const newContent = newMsg.cleanContent.toString().slice(0, 900);

    const ch = oldMsg.guild.channels.resolve(channel) as TextChannel;
    if (!ch) return;

    return ch.send(
      new KyflxEmbed(newMsg)
        .setTitle(`Event: Message Update`)
        .setDescription(
          [
            `**Channel**: ${newMsg.channel} (${newMsg.channel.id})`,
            `**Link**: ${newMsg.url}`,
            `**Author**: ${newMsg.author.tag} (${newMsg.author.id})`
          ].join("\n")
        )
        .addField(`Old Message:`, oldContent)
        .addField(`New Message:`, newContent)
        .setTimestamp()
    );
  }
}
