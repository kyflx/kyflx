import { Command, trunc, VorteEmbed, paginate } from "@vortekore/lib";
import { Message, Util } from "discord.js";
import ms = require("ms");

export default class extends Command {
  public constructor() {
    super("queue", {
      aliases: ["queue", "q", "next"],
      description: t => t("cmds:music.queue.desc"),
      channel: "guild",
      args: [
        {
          id: "page",
          type: "number"
        }
      ]
    });
  }

  public async exec(message: Message, { page }: { page: number }) {
    const tracks = message.queue.next.filter(t => t);
    if (!tracks.length)
      return message.sem(message.t("cmds:music.queue.empty", { message }));

    const decoded = await this.client.music.decode(tracks);
    const np = await this.client.music.decode(message.queue.np.song);

    let total = decoded.reduce((prev, song) => prev + song.info.length, 0),
      paginated = paginate(decoded, page),
      index = (paginated.page - 1) * 10,
      upNext = "";

    paginated.items.length
      ? (upNext += paginated.items
          .map(
            song =>
              `${++index}. **[${trunc(
                Util.escapeMarkdown(song.info.title),
                30,
                false
              )}](${song.info.uri})** *${ms(song.info.length)}*`
          )
          .join("\n"))
      : (upNext = ``);
    if (paginated.maxPage > 1)
      upNext += message.t("cmds:music.queue.page");

    const queueEmbed = new VorteEmbed(message)
      .musicEmbed()
      .setDescription(upNext)
      .addField(
        `\u200B`,
        `**Now Playing:**\n**[${np.title}](${np.uri})** *${ms(np.length)}*`
      )
      .setFooter(`Queue Length: ${ms(total)} | VorteKore`);

    message.util.send(queueEmbed);
  }
}
