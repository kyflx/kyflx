import { Command, VorteEmbed } from "@vortekore/lib";
import { Message } from "discord.js";
import { VERTA_DEPENDENT } from '../../index';

export default class extends Command {
  public constructor() {
    super("stats", {
      aliases: ["stats", "statistics"],
      description: {
        content: "Shows some bot statistics"
      }
    });
  }

  public async exec(message: Message) {
    const embed = new VorteEmbed(message).baseEmbed();
    const verta = this.client.music;

    if(VERTA_DEPENDENT) await verta.getStats();

    embed.addField(
      "General",
      [
        `**Guilds**: ${this.client.guilds.size}`,
        `**Users**: ${this.client.users.size}`,
        `**Channels**: ${this.client.channels.size}`,
        `**Emojis**: ${this.client.emojis.size}`,
        "",
        `**Bot Ping**: ${Math.round(this.client.ws.ping)}ms`,
        VERTA_DEPENDENT
          ? `**Verta Ping**: ${Math.round(verta.ping)}ms`
          : ""
      ].join("\n"),
      true
    );

    embed.addField(
      "Memory Usage",
      [
        `**Main**: ${Math.round(
          process.memoryUsage().heapUsed / 1024 / 1024
        )}MB`,
        VERTA_DEPENDENT
          ? [
              `**Andesite (JVM)**: ${Math.round(
                verta.stats.node.heap.used / 1024 / 1024
              )}MB / ${Math.round(verta.stats.node.heap.max / 1024 / 1024)}MB`,
              `**Verta**: ${Math.round(
                verta.stats.verta.heapUsed / 1024 / 1024
              )}MB`
            ].join("\n")
          : ""
      ].join("\n"),
      true
    );

    // embed.addField("Commit Versions", [
    // 	`**Main**: ${}`,
    // 	`**Lib**: ${}`,
    // 	`**Verta**: ${}`
    // ])

    embed.setThumbnail(this.client.user.displayAvatarURL());

    return message.channel.send(embed);
  }
}
