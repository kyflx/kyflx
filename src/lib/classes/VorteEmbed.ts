import { Message, MessageEmbed } from "discord.js";

export default class VorteEmbed extends MessageEmbed {
  public constructor(public message: Message) {
    super();
    this.setAuthor(
      this.message.author.username,
      this.message.author.displayAvatarURL()
    )
      .setTimestamp()
      .setFooter(`VorteKore`)
      .setColor(
        this.message.guild
          ? this.message._guild.embedColor || "#0c6dcf"
          : "#0c6dcf"
      );
  }

  public baseEmbed(): this {
    return this;
  }

  public addField(name: any, value: any, inline: boolean = false): this {
    return this.addFields({ name, value, inline });
  }

  public errorEmbed(error?: string): this {
    const embed = this.setAuthor(
      "Error",
      this.message.author.displayAvatarURL()
    ).setColor("#ff5959");
    if (error)
      embed.setDescription(this.message.t("def:error_message", { error }));
    return embed;
  }
}
