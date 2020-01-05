import { Command, VorteEmbed } from "@vortekore/lib";
import { Message } from "discord.js";

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

    embed.addField(
      "General",
      [
        `**Guilds**: ${this.client.guilds.size}`,
        `**Users**: ${this.client.users.size}`,
        `**Channels**: ${this.client.channels.size}`,
        `**Emojis**: ${this.client.emojis.size}`,
        "",
        `**Bot Ping**: ${Math.round(this.client.ws.ping)}ms`
      ].join("\n"),
      true
    );

    embed.addField(
      "Memory Usage",
      `**Main**: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
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
