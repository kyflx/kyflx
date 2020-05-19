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

export abstract class MusicUtil {
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
