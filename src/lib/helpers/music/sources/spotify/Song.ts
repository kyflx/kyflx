import { Track as LavalinkTrack } from "@kyflx-dev/lavalink-types";

import { Song } from "../../lib";
import { Track, Album } from "../../../../../types/apis";

export class SpotifySong extends Song {
  public extra = { color: 0x1db954 };
  constructor(data: LavalinkTrack, sptrack: Track, album: Album) {
    super(data);

    this.identifier = data.info.identifier;
    this.author = sptrack.artists.map((a) => a.name).join(", ");
    this.title = sptrack.name;
    this.url = sptrack.external_urls.spotify;

    if (album) {
      const [cover] = album.images.sort((a, b) => b.width - a.width);
      this.artwork = cover.url;
    }
  }
}
