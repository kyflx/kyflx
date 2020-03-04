import { Guild, MessageEmbed, TextChannel } from "discord.js";
import { Listener, LogChannels } from "../../../lib";

export default class GuildCreateListener extends Listener {
  public constructor() {
    super("guild-created", {
      event: "guildCreate",
      emitter: "client"
    });
  }

  async exec(guild: Guild) {
    await this.client.findOrCreateGuild(guild.id);
    const logs = <TextChannel>this.client.channels.resolve(LogChannels.GUILDS);

    return logs.send(
      new MessageEmbed({
        thumbnail: guild.iconURL() ? { url: guild.iconURL()! } : {}
      })
        .setColor("GREEN")
        .setTitle("New Guild!")
        .setDescription(
          `I have joined a new guild called "${guild.name}", they have **${
            guild.members.cache.filter(g => !g.user.bot).size
          }** members!\n\nWe now have **${this.client.guilds.cache.size.toLocaleString()}** guilds!`
        )
    );
  }
}
