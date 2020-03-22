import { Guild, MessageEmbed } from "discord.js";
import { logs } from "../../..";
import { Listener } from "../../../lib";

export default class GuildCreateListener extends Listener {
  public constructor() {
    super("guild-created", {
      event: "guildCreate",
      emitter: "client"
    });
  }

  public async exec(guild: Guild) {
    this.client.ensureGuild(guild.id);
    return logs.send(
      new MessageEmbed({
        thumbnail: guild.iconURL() ? { url: guild.iconURL() } : {}
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
