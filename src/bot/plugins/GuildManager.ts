import Logger from "@ayanaware/logger";
import Discord from "discord.js";
import {
  CaseEntity,
  formatString,
  Plugin,
  ProfileEntity,
  ReactionMenu,
  Subscribe,
  VorteEmbed
} from "../../lib";
import ms = require("ms");

export default class GuildManagerPlugin extends Plugin {
  public name: string = "guild_manager";
  public log: Logger = Logger.get("GuildManager");

  public async onReady(client = this.client) {
    setInterval(async () => {
      if (!this.client.database.ready) return;
      for (const x of await CaseEntity.find()) {
        if (!x.other || !x.other.temp || x.other.finished) continue;
        if (x.other.duration <= Date.now()) {
          try {
            const guild = client.guilds.resolve(x.guildId);
            if (!guild) CaseEntity.delete({ id: x.id });

            const _guild = await client.findOrCreateGuild(guild.id);
            if (!_guild.muteRole) CaseEntity.delete({ id: x.id });

            switch (x.type) {
              case "ban":
                if ((await guild.fetchBans()).has(x.subject))
                  await guild.members.unban(x.subject, "Time's Up");
                break;
              case "mute":
                const muteRole = guild.roles.resolve(_guild.muteRole);
                if (muteRole)
                  guild.members
                    .resolve(x.subject)
                    .roles.remove(muteRole)
                    .catch(e =>
                      this.log.error(e, `unmute (G${guild.id} U${x.subject})`)
                    );
                break;
            }

            x.other.finished = true;
            await x.save();

            const chan = <Discord.TextChannel>(
              guild.channels.resolve(_guild.channels.audit)
            );
            if (chan)
              chan.send(
                new Discord.MessageEmbed()
                  .setColor(_guild.embedColor)
                  .setAuthor(
                    `Temp. ${x.type.capitalize()} [ Case ID: ${x.id} ]`
                  )
                  .setDescription(  
                    `**<@${x.subject}>** \`(${x.subject})\` is now ${
                      x.type === "ban" ? "unbanned" : "unmuted"
                    }.`
                  )
              );
          } catch (error) {
            this.log.error(error, "Temp. Case Interval");
          }
        }
      }
    }, 10000);
  }

  public async checkWarns(message: Discord.Message, profile: ProfileEntity) {
    const punishment = message._guild.warnPunishments[profile.warns];
    if (punishment) {
      const _case = new CaseEntity(++message._guild.cases, message.guild.id);
      _case.subject = profile.userId;
      _case.moderator = this.client.user.id;
      _case.reason = `Reached ${profile.warns} warns.`;
      _case.type = punishment.type;
      _case.other = punishment.duration
        ? {
            temp: true,
            duration: Date.now() + punishment.duration,
            finished: false
          }
        : null;

      const logs = <Discord.TextChannel>(
          (message._guild.channels.audit
            ? message.guild.channels.resolve(message._guild.channels.audit)
            : null)
        ),
        embed = new VorteEmbed(message)
          .setThumbnail(this.client.user.displayAvatarURL())
          .setDescription(
            [
              `**Staff Member**: ${this.client.user}`,
              `**Victim**: <@${profile.userId}> \`(${profile.userId})\``,
              `**Reason**: Reached \`${profile.warns}\` warns.`,
              punishment.duration
                ? `**Duration**: ${ms(punishment.duration, {
                    long: true
                  })}`
                : ""
            ].join("\n")
          ),
        member = message.guild.member(profile.userId);

      try {
        switch (punishment.type) {
          case "kick":
          case "ban":
            await member[punishment.type]();
            break;
          case "mute":
            let muteRole = message.guild.roles.resolve(message._guild.muteRole);
            await member.roles.add(muteRole);
            break;
        }
      } catch (error) {
        this.log.error(error, `${message.guild.id} warn punishments`);
        return message.sem(message.t("automod:warns.error", { action: "ban", error }));
      }

      embed.setAuthor(
        `${
          punishment.duration ? `Temp. ` : ""
        }${punishment.type.capitalize()} [ Case ID: ${_case.id} ]`
      );

      await _case.save();
      await message._guild.save();

      if (logs && message._guild.logs[punishment.type]) logs.send(embed);
      return false;
    } else return true;
  }

  public async createMuteRole(message: Discord.Message): Promise<Discord.Role> {
    const muteRole = await message.guild.roles.create({
      data: {
        name: "Muted",
        permissions: 0,
        color: "#1f1e1c"
      }
    });

    message._guild.muteRole = muteRole.id;
    for (const [, c] of message.guild.channels.cache.filter(
      c => c.type === "category"
    ))
      await c.createOverwrite(
        muteRole,
        {
          SEND_MESSAGES: false
        },
        "Creating mute role."
      );

    return muteRole;
  }

  public getData(
    reaction: Discord.MessageReaction,
    user: Discord.User
  ): { msg: ReactionMenu; role: string } {
    if (user.bot) return;
    if (reaction.message.channel.type === "dm") return;

    const _guild = reaction.message._guild;
    if (!_guild.reactionRoles[reaction.message.id]) return;

    const msg = _guild.reactionRoles[reaction.message.id];
    const role = msg.roles[reaction.emoji.id || reaction.emoji.name];
    return !role ? null : { msg, role };
  }

  @Subscribe("messageReactionAdd")
  public async reactionAdd(
    reaction: Discord.MessageReaction,
    user: Discord.User
  ) {
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
            msg.roles[other.emoji.id || other.emoji.name]
          );
      }
      await member.roles.add(role);
    } catch (error) {
      return this.client.logger.info("Can't manage roles", message.guild.id);
    }
  }

  @Subscribe("messageReactionRemove")
  public async reactionRemove(
    reaction: Discord.MessageReaction,
    user: Discord.User
  ) {
    const data = this.getData(reaction, user),
      message = reaction.message;
    if (!data) return;
    const member = message.guild.member(user);
    if (member.roles.resolve(data.role)) member.roles.remove(data.role);
  }

  @Subscribe("guildMemberAdd")
  public async newMember(member: Discord.GuildMember) {
    const guild = await this.client.findOrCreateGuild(member.guild.id);

    const { channel, enabled } = guild.log("memberJoined", "audit");
    if (enabled && channel) {
      const tc = member.guild.channels.resolve(channel) as Discord.TextChannel;
      if (tc) tc.send(formatString(guild.welcomeMessage, member));
    }

    if (guild.verification.type) {
      switch (guild.verification.type) {
        case "captcha":
          break;
        case "command":
          break;
      }
    }

    if (guild.autoRoles.length > 0) await member.roles.add(guild.autoRoles);
  }

  @Subscribe("guildBanAdd")
  public newBan(guild: Discord.Guild, user: Discord.PartialUser) {
    return CaseEntity.find({
      where: {
        guildId: guild.id,
        subject: user.id,
        type: "ban"
      }
    }).then(cases => {
      const _case = cases[0];
      if (!_case || (_case.other && _case.other.temp))
        return ProfileEntity.findOneOrFail({
          where: { guildId: guild.id, userId: user.id }
        })
          .then(ProfileEntity.delete)
          .catch(e => this.log.error(e, `(${user.id})[${guild.id}]`));
      return;
    });
  }

  @Subscribe("guildMemberRemove")
  public async memberLeave(member: Discord.GuildMember) {
    const guild = await this.client.findOrCreateGuild(member.guild.id);
    const channel = guild.logs.memberJoined;
    if (!channel) return;

    const welcomeChannel = member.guild.channels.resolve(
      channel
    ) as Discord.TextChannel;
    if (!welcomeChannel) return;
    return welcomeChannel.send(formatString(guild.farewellMessage, member));
  }
}
