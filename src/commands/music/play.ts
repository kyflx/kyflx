import { Command, trunc, VorteEmbed } from "@vortekore/lib";
import { Video } from "better-youtube-api";
import { Argument } from "discord-akairo";
import { Message, Util } from "discord.js";
import { parse } from "url";
import { In, search as searchYT } from "../../util";
import QueueHook from "../../util/QueueHook";

export default class extends Command {
  public constructor() {
    super("play", {
      aliases: ["play", "add"],
      description: t => t("cmds:music.play.desc"),
      channel: "guild",
      args: [
        {
          id: "search",
          type: Argument.compose("string", (_, str) =>
            str.replace(/<(.+)>/g, "$1")
          ),
          prompt: {
            start: "Provide a playlist url, song title or url."
          },
          match: "rest"
        }
      ]
    });
  }

  public async exec(message: Message, { search }: { search: string }) {
    if (!message.queue.hook) message.queue.hook = new QueueHook(message.queue);
    if (message.guild.me.voice.channel && !In(message.member!))
      return message.sem(message.t("cmds:music.join"), {
        type: "error"
      });

    if (!message.member!.voice.channel)
      return message.sem(message.t("cmds:music.join_vc"), { type: "error" });

    if (!message.member.voice.channel.joinable)
      return message.sem(message.t("cmds:music.play.join"), {
        type: "error"
      });
    if (!message.member.voice.channel.speakable)
      return message.sem(message.t("cmds:music.play.speak"), {
        type: "error"
      });

    let response,
      queue = message.queue;
    if (!["http:", "https:"].includes(parse(search).protocol!)) {
      await searchYT(search)
        .then(async results => {
          const embed = new VorteEmbed(message).baseEmbed().setDescription(
            results
              .slice(0, 5)
              .map(
                (song, index) =>
                  `${++index}. **[${Util.escapeMarkdown(
                    trunc(song.title, 50, false)
                  )}](${song.url})** ${
                    song instanceof Video ? "[Video]" : "Playlist"
                  }`
              )
              .join("\n") + message.t("cmds:music.play.cancel")
          );

          const sent = (await message.util.send(embed)) as Message;
          return sent.channel
            .awaitMessages(m => m.author.id === message.author.id, {
              max: 1,
              errors: ["time"],
              time: 10000
            })
            .then(async messages => {
              const msg = messages.first();
              if (msg.deletable) await msg.delete();
              if (msg.content.ignoreCase("cancel") || !msg)
                return message.sem(message.t("cmds:music.play.cancelled"));
              const i = this.handler.resolver.type("number")(msg, msg.content);
              if (!i || typeof results[i - 1] === "undefined")
                return message.sem(message.t("cmds:music.play.cancelled"));
              return (response = await this.client.music.load(
                results[i - 1].url
              ));
            })
            .catch(() => {
              return message.sem(message.t("cmds:music.play.cancelled"));
            });
        })
        .catch(() => {
          return message.sem(message.t("cmds:music.play.quota"));
        });
    } else response = await this.client.music.load(search);
    if (!response) return;

    if (!message.guild.me.voice.channel)
      await queue.player.join(message.member.voice.channel.id);
    else if (!In(message.member!))
      return message.sem(message.t("cmds:music.join"), {
        type: "error"
      });

    let msg;
    if (["TRACK_LOADED", "SEARCH_RESULT"].includes(response.loadType)) {
      await queue.add(response.tracks[0].track);
      msg = `[${response.tracks![0].info.title}](${
        response.tracks![0].info.uri
      })`;
    } else if (response.loadType === "PLAYLIST_LOADED") {
      await queue.add(...response.tracks.map(track => track.track));
      msg = response.playlistInfo!.name;
    } else
      return message.sem(message.t("cmds:music.play.look"), {
        type: "error"
      });

    if (!queue.player.playing && !queue.player.paused) await queue.start();
    return message.sem(`Queued up **${Util.escapeMarkdown(msg)}** :)`);
  }
}
