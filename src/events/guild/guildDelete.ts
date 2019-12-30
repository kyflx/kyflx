import { Guild, MessageEmbed, TextChannel } from "discord.js";
import { Event, GuildEntity } from "@vortekore/lib";

export default class extends Event {
  public constructor() {
    super("guild-deleted", {
      category: "guild",
      event: "guildDelete"
    });
  }

  async run(guild: Guild) {
    await GuildEntity.delete({ guildId: guild.id });
    
    const logs = <TextChannel> await this.bot.channels.fetch("613827877015650304");
    return logs.send(new MessageEmbed({ thumbnail: guild.iconURL() ? { url: guild.iconURL()! } : {} })
      .setColor("RED")
      .setTitle("Oh no :(")
      .setDescription(`I have left a guild called "${guild.name}" :( \n\nWe now have ${this.bot.guilds.size.toLocaleString()}`))
  };
}