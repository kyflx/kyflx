import { Track } from "@kyflx-dev/lavalink-types";
import { YTAPI } from "../../../../../core";
import { Song } from "../../lib";

export class YoutubeSong extends Song {
  public extra: { likes: number; dislikes: number; views: number };

  public constructor(data: Track) {
    super(data);
  }

  public async load(api: YTAPI) {
    const video = await api.video(this.identifier);
    if (video) {
      this.artwork = bestThumbnail(video.snippet.thumbnails);
    }

    return this;
  }
}

function bestThumbnail(thumbnails: Record<string, any>): string {
  if (!thumbnails) return "";
  const { high, maxres, medium, standard } = thumbnails;
  return (maxres || high || medium || standard || thumbnails["default"]).url;
}
