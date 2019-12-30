import { paginate } from "../../util";
import {
  Command,
  VorteMessage,
  ProfileEntity,
  VorteEmbed
} from "@vortekore/lib";

export default class extends Command {
  public constructor() {
    super("leaderboard", {
      aliases: ["lb"],
      category: "Economy",
      cooldown: 500
    });
  }

  public async run(message: VorteMessage, [selected]: any) {
    let members = await ProfileEntity.find({ guildId: message.guild!.id });
    if (!members.length) return message.sem("Nothing to show ¯\\_(ツ)_/¯");
    members = members.sort((a, b) => b.xp - a.xp);

    let { items, page } = paginate(members, selected),
      str = "",
      index = (page - 1) * 10;

    for (const member of items) {
      const user = this.bot.users.get(member.userId)!;
      const padding = members.reduce((total, { userId }) => {
        const user = this.bot.users.get(userId);
        return user ? total + user.username.length : total;
      }, 0);
      str += `${++index}. ${(user ? user.username : "Unknown").padEnd} : ${
        member.level
      } [${member.xp}]\n`;
    }
    str += `Page : ${page}`;

    const leaderboardEmbed = new VorteEmbed(message)
      .baseEmbed()
      .setAuthor("Leaderboard", message.author.displayAvatarURL())
      .setDescription("```\n" + str + "```");
    return message.channel.send(leaderboardEmbed);
  }
}
