import { Command, VorteEmbed, MC_Emotes, Presences } from "../../../lib";
import { Message } from "discord.js";

export default class MemberCountCommand extends Command {
  public constructor() {
    super("member-count", {
      aliases: ["member-count", "mc", "members"],
      description: t => t("cmds:util.mc.desc")
    });
  }

  public async exec(message: Message) {
    const cache = message.guild.members.cache;
    const embed = new VorteEmbed(message)
      .setAuthor(
        message.guild.name,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setDescription(
        `**${message.guild.name}** has a total of \`${
          cache.size
        }\` members, with **${
          cache.filter(m => !m.user.bot).size
        } users** and **${cache.filter(m => m.user.bot).size} bots**.`
      );

    if (message.guild.icon) message.guild.iconURL();

    const statuses: Record<string, number> = Object.assign(
      {},
      ...["idle", "online", "offline", "dnd"].map(T => ({ [T]: 0 }))
    );
    for (const [, m] of cache) statuses[m.user.presence.status] += 1;

    embed.addField(
      "\u200b",
      Object.keys(statuses).map(
        k => `**${MC_Emotes[k]} ${Presences[k]}** ${statuses[k]}`
      )
    );

    return message.channel.send(embed);
  }
}
