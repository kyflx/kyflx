import { Track } from "@kyflx-dev/lavalink-types";
import { APIWrapper } from "@kyflx-dev/util";

import { Song } from "./Song";
import { PlaylistInfo } from "./Util";

export class Playlist {
  public track: string;
  public color: number = 0xff0000;
  public source: string;
  protected tracks: Track[];

  public identifier: string;
  public songs: Song[];
  public title: string;
  public description?: string;
  public author?: string;
  public artwork?: string;

  public constructor(protected data: PlaylistInfo, tracks: Track[]) {
    this.identifier = data.identifier;
    this.tracks = tracks;
  }

  public load(api?: APIWrapper): Playlist | Promise<Playlist> {
    this.songs = this.tracks.map((song) => new Song(song));
    return this;
  }

  public get length() {
    return this.songs.reduce((last, song) => last + song.length, 0);
  }
}
