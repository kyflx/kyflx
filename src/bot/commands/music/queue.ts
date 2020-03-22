import { Message } from "discord.js";
import ms = require("ms");
import { Command, paginate, trunc, VorteEmbed } from "../../../lib";

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

    const decoded = tracks.map(this.client.decode);
    const np = this.client.decode(message.queue.np.song);

    const total = decoded.reduce((prev, song) => prev + Number(song.length), 0),
      paginated = paginate(decoded, page);

    let index = (paginated.page - 1) * 10,
      upNext = "";

    paginated.items.length
      ? (upNext += paginated.items
          .map(
            song =>
              `${++index}. **[${trunc(song.title, 30, false)}](${
                song.uri
              })** *${ms(Number(song.length))}*`
          )
          .join("\n"))
      : (upNext = ``);
    if (paginated.maxPage > 1) upNext += message.t("cmds:music.queue.page");

    const queueEmbed = new VorteEmbed(message)
      .baseEmbed()
      .setDescription(upNext)
      .addField(
        `\u200B`,
        `**Now Playing:**\n**[${np.title}](${np.uri})** *${ms(
          Number(np.length)
        )}*`
      )
      .setFooter(`Queue Length: ${ms(total)} | VorteKore`);

    return message.util.send(queueEmbed);
  }
}
