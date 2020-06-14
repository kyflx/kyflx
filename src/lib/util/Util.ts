import { DecodedSong, Song } from "../helpers";
import { Message } from "discord.js";
import { Util as Util1 } from "@kyflx-dev/util";
import { TrackInfo } from "@kyflx-dev/lavalink-types";

export type SourceType = "http" | "youtube" | "twitch" | "soundcloud" | "mixer";
export type PlaylistInfo = { identifier?: string; source?: "youtube" };

/** RegExp's */
export const HTTP_STREAM_REGEX = /^(icy|https?):\/\/(.*)$/;
export const YOUTUBE_VIDEO_ID_REGEX = /([a-zA-Z0-9_-]{11})/;
export const TWITCH_STREAM_NAME_REGEX = /^https?:\/\/(?:www\.|go\.)?twitch\.tv\/([^/]+)$/;
export const SOUNDCLOUD_TRACK_URL_REGEX = /^(?:https?:\/\/|)(?:www\.|m\.|)soundcloud\.com\/([a-zA-Z0-9-_]+)\/([a-zA-Z0-9-_]+)(?:\\?.*|)$/;
export const MIXER_STREAM_REGEX = /^https?:\/\/(?:www\.)?beam\.pro\/([^/]+)$/;
export const YOUTUBE_PLAYLIST_REGEX = /list=((RD|PL|LL|FL|UU)[a-zA-Z0-9_-]+)/;

export abstract class Util extends Util1 {
  public static humanify(perms: string[]): string[] {
    return perms.map((perm) =>
      perm
        .split("_")
        .map((p) => p.replace(/(\b\w)/gi, (lc) => lc.toUpperCase()))
        .join(" ")
    );
  }

  public static decodeSong(song: string): DecodedSong {
    return JSON.parse(Buffer.from(song, "base64").toString("ascii"));
  }

  public static encodeSong(song: Song): string {
    return Buffer.from(JSON.stringify(song)).toString("base64");
  }

  public static progressBar(percent: number, length = 20) {
    let str = "";
    for (let i = 0; i < length; i++) {
      if (i === Math.round(percent * length)) str += "▬";
      else str += "―";
    }
    return str;
  }

  public static playerEmbed(message: Message) {
    const np = this.decodeSong(message.queue.np.song);
    return `${Util.progressBar(
      message.player.state.position / Number(np.length)
    )} \`[${Util.formatTime(message.player.state.position)}/${Util.formatTime(
      Number(np.length)
    )}]\``;
  }

  public static formatTime(duration: number) {
    const minutes = Math.floor(duration / 60000);
    const seconds = Number(((duration % 60000) / 1000).toFixed(0));
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  }

  public static getSource(song: TrackInfo): SourceType {
    const { uri, identifier: id } = song;
    if (TWITCH_STREAM_NAME_REGEX.test(uri)) return "twitch";
    if (SOUNDCLOUD_TRACK_URL_REGEX.test(uri)) return "soundcloud";
    if (HTTP_STREAM_REGEX.test(id)) return "http";
    if (YOUTUBE_VIDEO_ID_REGEX.test(id)) return "youtube";
    if (MIXER_STREAM_REGEX.test(uri)) return "mixer";
  }

  public static getPlaylist(query: string): PlaylistInfo {
    return YOUTUBE_PLAYLIST_REGEX.test(query)
      ? { identifier: YOUTUBE_PLAYLIST_REGEX.exec(query)[1], source: "youtube" }
      : {};
  }

  public static getTwitchLogin(url: string) {
    const result = TWITCH_STREAM_NAME_REGEX.exec(url);
    return result ? result[1] : null;
  }
}
