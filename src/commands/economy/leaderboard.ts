import { Command, ProfileEntity, VorteEmbed, paginate } from "@vortekore/lib";
import { Message } from "discord.js";

export default class extends Command {
  public constructor() {
    super("leaderboard", {
      aliases: ["leaderboard", "lb"],
      args: [
        {
          id: "page",
          default: 1,
          type: "number"
        }
      ]
    });
  }

  public async exec(message: Message, { page: selected }: { page: number }) {
    let members = await ProfileEntity.find({ guildId: message.guild!.id });
    if (!members.length) return message.sem("Nothing to show ¯\\_(ツ)_/¯");
    members = members.sort((a, b) => b.xp - a.xp);

    let { items, page } = paginate(members, selected),
      str = "",
      index = (page - 1) * 10;

    for (const member of items) {
      const user = this.client.users.get(member.userId)!;
      str += `${++index}. ${user ? user.username : "Unknown"} : ${
        member.level
      } [${member.xp}]\n`;
    }
    str += `Page : ${page}`;

    const leaderboardEmbed = new VorteEmbed(message)
      .baseEmbed()
      .setAuthor("Leaderboard", message.author.displayAvatarURL())
      .setDescription("```prolog\n" + str + "```");
    return message.util.send(leaderboardEmbed);
  }
}
