import { Track } from "@kyflx-dev/lavalink-types";
import { APIWrapper } from "@kyflx-dev/util";

export class Song {
  public track: string;

  public identifier: string;
  public source: string;
  public seekable: boolean;
  public author: string;
  public length: number;
  public stream: boolean;
  public position: number;
  public title: string;
  public url: string;

  public extra: Record<string, any> = { color: 0xff0000 };
  public artwork?: string;

  public constructor(data: Track) {
    this.track = data.track;

    this.identifier = data.info.identifier;
    this.seekable = data.info.isSeekable;
    this.author = data.info.author;
    this.length = data.info.length;
    this.stream = data.info.isStream;
    this.position = data.info.position;
    this.title = data.info.title;
    this.url = data.info.uri;
  }

  public load(_api?: APIWrapper): Song | Promise<Song> {
    return this;
  }
}
