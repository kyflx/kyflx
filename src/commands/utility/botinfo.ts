import { Command, get, VorteEmbed } from "@vortekore/lib";
import { Message } from "discord.js";
import ms from "ms";

export default class extends Command {
  public constructor() {
    super("botinfo", {
      aliases: ["bot-info", "bi"],
      description: t => t("cmds:util.bi.desc")
    });
  }

  public async exec(message: Message) {
    const emb = new VorteEmbed(message)
      .baseEmbed()
      .setAuthor(
        `${this.client.user!.username} Bot Info`,
        this.client.user!.displayAvatarURL()
      )
      .setDescription(message.t("cmds:util.bi.info"))
      .addField(
        "\u200B",
        [
          `**Guild Count**: ${this.client.guilds.size}`,
          `**Total Users**: ${this.client.users.size}`,
          `**Total Commands**: ${this.client.commands.modules.size}`,
          `**Uptime:** ${ms(this.client.uptime!, { long: true })}`,
          `[Invite](http://bit.ly/VorteKore) • [Github](https://github.com/VorteKore/) • [Vote](https://top.gg/bot/634766962378932224)`
        ].join("\n")
      );
    const commits = await this.getCommits();
    if (commits) emb.addField("Github Commits", commits);
    return message.util.send(emb);
  }

  private async getCommits() {
    let { data, error } = await get<GithubCommits.RootCommit[]>(
        "https://api.github.com/repos/VorteKore/Core/commits"
      ),
      str = "";
    if (!data) return this.logger.error(error);

    for (const { sha, html_url, commit, author } of data
      .filter(c => c.author.type.ignoreCase("user"))
      .slice(0, 5))
      str += `[\`${sha.slice(0, 7)}\`](${html_url}) ${commit.message.trunc(
        80,
        true
      )} - **[@${author.login.toLowerCase()}](${author.html_url})**\n`;

    return str;
  }
}
