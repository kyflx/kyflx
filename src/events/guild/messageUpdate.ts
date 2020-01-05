import { Listener, VorteEmbed } from "@vortekore/lib";
import { TextChannel, Message } from "discord.js";

export default class extends Listener {
  public constructor() {
    super("message-updated", {
      event: "messageUpdate",
      emitter: "client"
    });
  }

  public async exec(oldmsg: Message, newmsg: Message) {
    return;
    const guild = await this.client.findOrCreateGuild(oldmsg.guild!.id);
    if (!guild.logs.channel && !guild.logs.editMessage) return;

    const oldcon = oldmsg.cleanContent.toString().slice(0, 900);
    const newcon = newmsg.cleanContent.toString().slice(0, 900);
    const ch = oldmsg.guild!.channels.get(guild.logs.channel) as TextChannel;

    if (!ch) return;

    ch.send(
      new VorteEmbed(newmsg)
        .baseEmbed()
        .setTitle(`Event: Message Update`)
        .setDescription(
          [
            `**Channel**: ${newmsg.channel} (${newmsg.channel.id})`,
            `**Link**: ${newmsg.url}`,
            `**Author**: ${newmsg.author.tag} (${newmsg.author.id})`
          ].join("\n")
        )
        .addField(`Old Message:`, oldcon)
        .addField(`New Message`, newcon)
        .setTimestamp()
    );
  }
}
