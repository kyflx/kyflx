import { Guild, MessageEmbed, TextChannel } from "discord.js";
import { Listener } from "@vortekore/lib";

export default class extends Listener {
  public constructor() {
    super("guild-created", {
      event: "guildCreate",
      emitter: "client"
    });
  }

  async exec(guild: Guild) {
    await this.client.findOrCreateGuild(guild.id);
    const logs = <TextChannel>(
      await this.client.channels.fetch("613827877015650304")
    );

    return logs.send(
      new MessageEmbed({
        thumbnail: guild.iconURL() ? { url: guild.iconURL()! } : {}
      })
        .setColor("GREEN")
        .setTitle("New Guild!")
        .setDescription(
          `I have joined a new guild called "${guild.name}", they have ${
            guild.members.filter(g => !g.user.bot).size
          } members!\n\nWe now have ${this.client.guilds.size.toLocaleString()} guilds!`
        )
    );
  }
}
