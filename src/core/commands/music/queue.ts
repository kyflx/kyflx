import { Message } from "discord.js";
import { Command } from "klasa";
import { GuildCommand, Util } from "../../../lib";

@GuildCommand({ usage: "[page:number]" })
export default class LeaveCommand extends Command {
  public async run(message: Message, [selected]: [number]) {
    if (!message.player) return message.reply(message.t("music.nope"));

    const decoded = message.queue.next.map((s) => Util.decodeSong(s));
    if (!decoded.length) return message.reply(message.t("music.queue.empty"));

    const { items, maxPage, page } = Util.paginate(decoded, selected),
      np = Util.decodeSong(message.queue.np.song),
      embed = this.client.embed(message);
    let i = (page - 1) * 10;

    const str = items.map(
      (s) =>
        `**#${++i}.** **[\`${s.title}\`](${s.url})** *${Util.formatTime(
          s.length
        )}*`
    );

    embed
      .addField(`• Current:`, `**[\`${np.title}\`](${np.url})**`)
      .addField("\u200b", str);

    if (maxPage > 1)
      embed.addField(
        "\u200b",
        message.t("music.queue.paginate", page, maxPage)
      );

    return message.send(embed);
  }
}
