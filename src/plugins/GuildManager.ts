import Logger from "@ayanaware/logger";
import {
  CaseEntity,
  ClientPlugin,
  ReactionMsgs,
  Subscribe
} from "@vortekore/lib";
import {
  GuildMember,
  MessageEmbed,
  MessageReaction,
  TextChannel,
  User
} from "discord.js";
import { formatString } from "../util";

export default class GuildManagerPlugin extends ClientPlugin {
  public name: string = "guild_manager";
  public log: Logger = Logger.get("GuildManager");

  public async onReady(client = this.client) {
    if (!client.database.ready) return;
    console.log("bullshit")

    setInterval(async () => {
      for (const x of await CaseEntity.find()) {
        if (!x.other || !x.other.temp || x.other.finished) continue;
        if (x.other.duration <= Date.now()) {
          try {
            const guild = client.guilds.resolve(x.guildId);
            if (!guild) CaseEntity.delete({ id: x.id });

            const _guild = await client.findOrCreateGuild(guild.id);
            if (!_guild.muteRole) CaseEntity.delete({ id: x.id });

            const member =
              guild.members.resolve(x.subject) ||
              (await guild.members.fetch(x.subject)) ||
              null;
            if (!member) CaseEntity.delete({ id: x.id });

            switch (x.type) {
              case "ban":
                await guild.members.unban(member, "Times Up");
                break;
              case "mute":
                const muteRole = guild.roles.resolve(_guild.muteRole);
                member.roles.remove(muteRole).catch(null);
                break;
            }

            x.other.finished = true;

            const chan = <TextChannel>(
              guild.channels.resolve(_guild.channels.audit)
            );
            if (chan)
              chan.send(
                new MessageEmbed()
                  .setColor(_guild.embedColor)
                  .setTitle(`Temporary Action [ Case ID: ${x.id} ]`)
                  .setDescription(
                    `**${member}** \`(${member.id})\` is now ${
                      x.type === "ban" ? "unbanned" : "unmuted"
                    }.`
                  )
              );

            await x.save();
          } catch (error) {
            this.log.error(error, "Temp. Case Interval");
          }
        }
      }
    }, 10000);
  }

  public checkWarns(member: GuildMember, _case: CaseEntity) {}

  public getData(
    reaction: MessageReaction,
    user: User
  ): { msg: ReactionMsgs; role: string } {
    if (user.bot) return;
    if (reaction.message.channel.type === "dm") return;

    const _guild = reaction.message._guild;
    if (!_guild.reactionRoles[reaction.message.id]) return;

    const msg = _guild.reactionRoles[reaction.message.id];
    const role = msg.roles[reaction.emoji.id || reaction.emoji.name] as string;
    return !role ? null : { msg, role };
  }

  @Subscribe("messageReactionAdd")
  public async reactionAdd(reaction: MessageReaction, user: User) {
    const data = this.getData(reaction, user),
      message = reaction.message;
    if (!data) return;
    const { msg, role } = data;

    const others = message.reactions.cache.filter(
      r => !!msg.roles[r.emoji.id || r.emoji.name]
    );
    try {
      const member = message.guild.member(user);
      if (msg.type !== "multi") {
        const other = others.find(
          m =>
            m.users.resolve(user.id) &&
            msg.roles[m.emoji.id || m.emoji.name] === role
        );
        if (other)
          await member.roles.remove(
            msg.roles[other.emoji.id || other.emoji.name] as string
          );
      }
      await member.roles.add(role);
    } catch (error) {
      return this.client.logger.info("Can't manage roles", message.guild.id);
    }
  }

  @Subscribe("messageReactionRemove")
  public async reactionRemove(reaction: MessageReaction, user: User) {
    const data = this.getData(reaction, user),
      message = reaction.message;
    if (!data) return;
    const { msg, role } = data;
  }

  @Subscribe("guildMemberAdd")
  public async newMember(member: GuildMember) {
    const guild = await this.client.findOrCreateGuild(member.guild.id);

    if (guild.autoRoles.length > 0)
      await member.roles.add(guild.autoRoles, "auto roles");

    const channel = guild.logs.memberJoined;
    if (!channel) return;

    const welcomeChannel = member.guild.channels.resolve(
      channel
    ) as TextChannel;
    if (!welcomeChannel) return;
    return welcomeChannel.send(formatString(guild.welcomeMessage, member));
  }

  @Subscribe("guildMemberRemove")
  public async memberLeave(member: GuildMember) {
    const guild = await this.client.findOrCreateGuild(member.guild.id);
    const channel = guild.logs.memberJoined;
    if (!channel) return;

    const welcomeChannel = member.guild.channels.resolve(
      channel
    ) as TextChannel;
    if (!welcomeChannel) return;
    return welcomeChannel.send(formatString(guild.farewellMessage, member));
  }
}
