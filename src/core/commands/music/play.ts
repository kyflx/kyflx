import { Message } from "discord.js";
import { Command } from "klasa";
import { Video } from "popyt";
import { GuildCommand, Playlist, Result, Song } from "../../../lib";

@GuildCommand({
  usage: "<song:string>",
  extendedHelp: (t) => t.get("music.play.help"),
  aliases: ["p"],
})
export default class PlayCommand extends Command {
  public async run(message: Message, [song]: [string]) {
    const channel = message.member.voice.channel;
    const settings = message.guildSettings;
    if (!message.player) {
      const vcLock = settings.get("channels.vc");

      if (!channel) return message.reply(message.t("music.join.jvc"));
      if (vcLock && channel.id !== vcLock) {
        return message.reply(message.t("music.vcl", { message }));
      }

      const perms = channel.permissionsFor(message.client.user.id);
      if (!perms.has(["SPEAK", "VIEW_CHANNEL"])) {
        return message.reply(message.t("music.join.perms"));
      }

      await this.client.music.join(
        { channel: channel.id, guild: message.guild.id },
        { deaf: true }
      );
    } else if (channel.id !== message.guild.me.voice.channelID) {
      return message.reply(message.t("music.myvc"));
    }

    if (message.queue.next.length >= settings.get("queueLength")) {
      return message.reply(
        message.t("music.play.ql", settings.get("queueLength"))
      );
    }

    let res = await this.client.music.load(song);
    if (!res.result) res = await this.search(message, song);
    if (res.error || !res.result)
      return message.reply(message.t("music.play.nf", res.error));

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
        try {
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
        } catch (error) {
          return new Result().setError(error);
        }
      });
  }
}
