import { Guild, MessageEmbed, TextChannel } from "discord.js";
import { GuildEntity, Listener } from "@vortekore/lib";
import { LogChannels } from "../../util";

export default class GuildDeleteListener extends Listener {
  public constructor() {
    super("guild-deleted", {
      event: "guildDelete",
      emitter: "client"
    });
  }

  async exec(guild: Guild) {
    await GuildEntity.delete({ guildId: guild.id });

    const logs = <TextChannel>this.client.channels.resolve(LogChannels.GUILDS);
    return logs.send(
      new MessageEmbed({
        thumbnail: guild.iconURL() ? { url: guild.iconURL()! } : {}
      })
        .setColor("RED")
        .setTitle("Oh no :(")
        .setDescription(
          `I have left a guild called "${
            guild.name
          }" :( \n\nWe now have **${this.client.guilds.cache.size.toLocaleString()}** guilds :(`
        )
    );
  }
}
