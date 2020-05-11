import { Message } from "discord.js";
import { Command } from "klasa";
import ms from "ms";

export default class extends Command {
  public async run(message: Message) {
    const e = this.client.embed(message),
      commits = await this.getCommits();

    e.setAuthor("Kyflx", message.client.user.displayAvatarURL()).setDescription(
      [
        message.t("description"),
        "",
        `**Guilds:** ${message.client.guilds.cache.size.toLocaleString()}`,
        `**Users:** ${message.client.users.cache.size.toLocaleString()}`,
        `**Commands:** ${this.store.size}`,
        `**Uptime:** ${ms(message.client.uptime, { long: true })}`,
        "",
        `[Vote](https://top.gg/bot/634766962378932224) • [Invite](${await message.client.generateInvite()}) • [Github](https://github.com/Kyflx)`,
      ].join("\n")
    );

    if (commits) e.addField("Github Commits", commits);
    return message.send(e);
  }

  public async getCommits() {
    const commits = await this.client.apis
      .api("github")
      .commits("kyflx", "kyflx");

    let str = "";
    for (const o of commits.filter((c) => c.author.type === "User").slice(0, 5))
      str += `[\`${o.sha.slice(0, 7)}\`](${o.html_url}) ${
        o.commit.message
      } - **[@${o.author.login}](${o.author.html_url})**\n`;
    return str;
  }
}
