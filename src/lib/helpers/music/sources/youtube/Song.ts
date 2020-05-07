import { Track } from "@kyflx-dev/lavalink-types";

import { Song } from "../../lib";
import { YTAPI } from "../../../../../core";

export class YoutubeSong extends Song {
  public extra: { likes: number; dislikes: number; views: number };
  public constructor(data: Track) {
    super(data);
  }

  public async load(api: YTAPI) {
    const video = await api.video(this.identifier);
    if (video) {
      const { likes, dislikes, views, thumbnails } = video;
      this.extra = Object.assign(this.extra, { likes, dislikes, views });
      this.artwork = bestThumbnail(thumbnails);
    }

    return this;
  }
}

function bestThumbnail(thumbnails: Record<string, any>): string {
  if (!thumbnails) return "";
  const { high, maxres, medium, standard } = thumbnails;
  return (maxres || high || medium || standard || thumbnails["default"]).url;
}
