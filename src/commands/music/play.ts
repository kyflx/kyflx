import { Command, trunc, VorteEmbed } from "@vortekore/lib";
import { Video } from "better-youtube-api";
import { Argument } from "discord-akairo";
import { Message, Util } from "discord.js";
import { parse } from "url";
import { In, search as searchYT } from "../../util";

export default class extends Command {
  public constructor() {
    super("play", {
      aliases: ["play", "add"],
      description: {
        content: "Plays a song in your voide channel.",
        usage: "<query>"
      },
      channel: "guild",
      args: [
        {
          id: "search",
          type: Argument.compose("string", (_, str) =>
            str?.replace(/<(.+)>/g, "$1")
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
    if (message.guild.me.voice.channel && !In(message.member!))
      return message.sem("Please join the voice channel I'm in.", {
        type: "error"
      });

    if (!message.member!.voice.channel)
      return message.sem("Please join a voice channel.", { type: "error" });

    if (!message.member.voice.channel.joinable)
      return message.sem("I don't have the permissions to join this channel.", {
        type: "error"
      });
    if (!message.member.voice.channel.speakable)
      return message.sem(
        "I don't have the permissions to talk in this channel.",
        {
          type: "error"
        }
      );

    let response,
      queue = message.queue;
    if (!["http:", "https:"].includes(parse(search).protocol!)) {
      await searchYT(search).then(async results => {
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
            .join("\n") + "\n\n**Send 'cancel' to cancel the selection.**"
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
            if (msg.deletable) msg.delete();
            if (msg.content.ignoreCase("cancel") || !msg)
              return message.sem("Okay, I cancelled the selection.");
            const i = this.client.commands.resolver.type("number")(
              msg,
              msg.content
            );
            if (!i || results[i - 1] === undefined)
              return message.sem("Okay, I cancelled the selection.");
            return (response = await this.client.music.load(
              results[i - 1].url
            ));
          })
          .catch(() => {
            return message.sem("Okay, I cancelled the selection.");
          });
      });
    } else response = await this.client.music.load(search);
    if (!response) return;

    if (!message.guild.me.voice.channel)
      await queue.player.join(message.member.voice.channel.id);
    else if (!In(message.member!))
      return message.sem("Please join the voice channel I'm in.", {
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
      return message.sem("Sorry, I couldn't find what you were looking for.", {
        type: "error"
      });

    if (!queue.player.playing && !queue.player.paused) await queue.start();
    return message.sem(`Queued up **${Util.escapeMarkdown(msg)}** :)`);
  }
}
