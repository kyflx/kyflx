import { Guild, MessageEmbed, TextChannel } from "discord.js";
import { Listener, GuildEntity } from "@vortekore/lib";

export default class extends Listener {
  public constructor() {
    super("guild-deleted", {
      event: "guildDelete",
      emitter: "client"
    });
  }

  async exec(guild: Guild) {
    await GuildEntity.delete({ guildId: guild.id });

    const logs = <TextChannel>(
      await this.client.channels.fetch("613827877015650304")
    );
    return logs.send(
      new MessageEmbed({
        thumbnail: guild.iconURL() ? { url: guild.iconURL()! } : {}
      })
        .setColor("RED")
        .setTitle("Oh no :(")
        .setDescription(
          `I have left a guild called "${
            guild.name
          }" :( \n\nWe now have ${this.client.guilds.size.toLocaleString()} guilds :(`
        )
    );
  }
}
