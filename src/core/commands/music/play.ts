import { Message } from "discord.js";
import { Command, CommandOptions } from "klasa";
import { Video } from "popyt";
import { Init, Playlist, Result, Song } from "../../../lib";

@Init<CommandOptions>({ runIn: ["text"], usage: "<song:string>" })
export default class PlayCommand extends Command {
  public async run(message: Message, [song]: [string]) {
    // if (!ctx.player) {
    //   if (!ctx.vc) return ctx.reply(ctx.t("cmds:music.join.vc"));
    //   if (ctx.settings.vcLock && ctx.vc.id !== ctx.settings.vcLock)
    //     return ctx.reply(ctx.t("cmds:music.vcl", { ctx }));

    //   const perms = ctx.vc.permissionsFor(ctx.client.user.id);
    //   if (!perms.has(["SPEAK", "VIEW_CHANNEL"]))
    //     return ctx.reply(ctx.t("cmds:music.join.perms"));

    //   await ctx.joinVc(ctx.vc);
    // } else if (!ctx.inVc(ctx.guild.me))
    //   return ctx.reply(ctx.t("cmds:music.mvc"));

    if (message.queue.next.length >= message.guild.settings.get("queueLength"))
      return message.reply(message.t("music.ql", { ctx: message }));

    let res: Result<Song | Playlist> = await this.client.music.load(
      song
    );
    if (!res.result) res = await this.search(message, song);
    if (!res.result) return message.reply(message.t("music.play.nf"));

    if (res.result instanceof Song) {
      message.queue.add(res.result);
      await message.send(
        this.client
          .embed(message)
          .setColor(res.result.extra.color)
          .setAuthor(res.result.author)
          .setThumbnail(res.result.artwork)
          .setDescription(res.result.title)
      );
    } else if (res.result instanceof Playlist) {
      message.queue.add(...res.result.songs);
      await message.send(
        this.client
          .embed(message)
          .setColor(res.result.color)
          .setAuthor(res.result.songs[0].author)
          .setThumbnail(res.result.artwork)
          .setDescription(res.result.title)
      );
    }

    if (!message.queue.np.song) await message.queue.start(message);
  }

  public search(message: Message, query: string): Promise<Result<Song>> {
    return message.client.apis
      .api("youtube")
      .search<Video>(query, 5)
      .then<Result<Song>>(async (results) => {
        const embed = this.client.embed(message).setDescription(
          results
            .slice(0, 5)
            .map(
              (r, i) =>
                `${++i}. **[${r.title.trunc(50)}](${r.url}) (${
                  r.constructor.name
                })**`
            )
            .join("\n")
        );

        await message.send(embed);
        return message.channel
          .awaitMessages((m) => m.author.id === message.author.id, {
            max: 1,
            errors: ["time"],
            time: 10000,
          })
          .then(async (collected) => {
            const m = collected.first();

            if (m.deletable) await m.delete();
            if (m.content.ignoreCase("cancel") || !m)
              return message.reply(message.t("music.play.cancelled"));

            const i = parseInt(m.content);
            if (!i || !results[i - 1])
              return message.reply(message.t("music.play.cancelled"));

            return await message.client.music.load(results[i - 1].url);
          }) as any;
      })
      .catch(() => message.reply(message.t("music.play.quota"))) as any;
  }
}
