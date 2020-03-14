import { Guild, MessageEmbed } from "discord.js";
import { logs } from "../../..";
import { GuildEntity, Listener } from "../../../lib";

export default class GuildDeleteListener extends Listener {
  public constructor() {
    super("guild-deleted", {
      event: "guildDelete",
      emitter: "client"
    });
  }

  async exec(guild: Guild) {
    await GuildEntity.delete({ guildId: guild.id });
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
