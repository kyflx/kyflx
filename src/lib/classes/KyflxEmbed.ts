import { Message, MessageEmbed } from "discord.js";

export default class KyflxEmbed extends MessageEmbed {
  public constructor(public message: Message) {
    super();
    this.setAuthor(
      this.message.author.username,
      this.message.author.displayAvatarURL()
    )
      .setTimestamp()
      .setFooter(`Kyflx`)
      .setColor(
        this.message.guild
          ? this.message._guild.embedColor || "BLURPLE"
          : "BLURPLE"
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
