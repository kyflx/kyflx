import { Track } from "@kyflx-dev/lavalink-types";

import { Song } from "../../lib";

export class SoundcloudSong extends Song {
  public extra = { color: 0xff8800 };

  public constructor(data: Track) {
    super(data);
  }

  public load() {
    this.artwork = `https://i.ytimg.com/vi/${this.identifier}/hqdefault.jpg`;
    return this;
  }
}
