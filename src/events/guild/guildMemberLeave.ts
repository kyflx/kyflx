import { GuildMember, TextChannel } from "discord.js";
import { formatString } from "../../util";
import { Listener } from "@vortekore/lib";

export default class extends Listener {
  public constructor() {
    super("member-leave", {
      event: "guildMemberRemove",
      emitter: "client"
    });
  }

  async exec(member: GuildMember) {
    const guild = await this.client.findOrCreateGuild(member.guild.id);
    const channel = guild.logs.memberJoined;
    if (!channel) return;

    const welcomeChannel = member.guild.channels.get(channel) as TextChannel;
    if (!welcomeChannel) return;

    welcomeChannel.send(formatString(guild.farewellMessage, member));
  }
}
