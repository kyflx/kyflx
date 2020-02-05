import { Command, trunc, VorteEmbed, paginate } from "@vortekore/lib";
import { Message, Util } from "discord.js";
import ms = require("ms");

export default class extends Command {
  public constructor() {
    super("queue", {
      aliases: ["queue", "q", "next"],
      description: {
        content: "Shows the current and next up songs."
      },
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
    const tracks = (await message.queue.tracks()).filter(t => t);
    if (!tracks.length)
      return message.sem(
        `Hmmmm... pretty empty, you should add some more songs with **${message.util.parsed.prefix}play**`
      );

    const decoded = await this.client.music.decode(tracks);
    const np = await this.client.music.decode(
      (await message.queue.current()).track
    );

    let total = decoded.reduceRight((prev, song) => prev + song.info.length, 0),
      paginated = paginate(decoded, page),
      index = (paginated.page - 1) * 10,
      upNext = "";

    paginated.items.length
      ? (upNext += paginated.items
          .map(
            song =>
              `${++index}. **[${Util.escapeMarkdown(
                trunc(song.info.title, 30, false)
              )}](${song.info.uri})** *${ms(song.info.length)}*`
          )
          .join("\n"))
      : (upNext = ``);
    if (paginated.maxPage > 1)
      upNext += '\n"Use queue <page> to view a specific page."';

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
