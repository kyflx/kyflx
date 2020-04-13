import { Message } from "discord.js";
import ms from "ms";
import { Command, get, GithubCommits, KyflxEmbed } from "../../../lib";

export default class BotInfoCommand extends Command {
  public constructor() {
    super("bot-info", {
      aliases: ["bot-info", "bi"],
      description: t => t("cmds:util.bi.desc")
    });
  }

  public async exec(message: Message) {
    const emb = new KyflxEmbed(message)
      .setAuthor(
        `${this.client.user.username} Bot Info`,
        this.client.user.displayAvatarURL()
      )
      .setDescription(message.t("cmds:util.bi.info"))
      .addField(
        "\u200B",
        [
          `**Guild Count**: ${this.client.guilds.cache.size}`,
          `**Total Users**: ${this.client.users.cache.size}`,
          `**Total Commands**: ${
            this.client.commands.modules.filter(cmd => cmd.aliases.length > 0)
              .size
          }`,
          `**Uptime:** ${ms(this.client.uptime, { long: true })}`,
          `[Invite](${await this.client.generateInvite(8)}) • [Github](https://github.com/kyflx/) • [Vote](https://top.gg/bot/634766962378932224)`
        ].join("\n")
      );
    const commits = await this.getCommits();
    if (commits) emb.addField("Github Commits", commits);
    return message.util.send(emb);
  }
  
  private async getCommits() {
    const { data, error } = await get<Array<GithubCommits>>(
      "https://api.github.com/repos/kyflx/kyflx/commits"
    );
    let str = "";
    if (!data) {
      this.logger.error(error);
      return;
    }

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
