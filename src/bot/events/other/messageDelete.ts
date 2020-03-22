import { Message, TextChannel, Util } from "discord.js";
import { Listener, log, VorteEmbed } from "../../../lib";

export default class MessageDeleteListener extends Listener {
  public constructor() {
    super("message-deleted", {
      event: "messageDelete",
      emitter: "client"
    });
  }

  public async exec(message: Message) {
    if (!message.guild) return;

    const guild = this.client.ensureGuild(message.guild.id);
    const { enabled, channel } = log(guild, "messageDelete", "audit");

    if (message.author.bot) return;
    if (!enabled || !channel) return;

    const chan = message.guild.channels.resolve(channel) as TextChannel;

    return chan.send(
      new VorteEmbed(message)
        .setTitle(`Event: Message Delete`)
        .setDescription(
          [
            `**Channel**: ${message.channel} (${message.channel.id})`,
            `**Link**: ${message.url}`,
            `**Author**: ${message.author.tag} (${message.author.id})`
          ].join("\n")
        )
        .addField(
          `Message Content:`,
          `${Util.escapeMarkdown(message.cleanContent.slice(0, 900))}`
        )
        .setTimestamp()
    );
  }
}
