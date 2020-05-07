import { Track } from "@kyflx-dev/lavalink-types";
import { Config } from "@kyflx-dev/util";
import { Collection } from "discord.js";
import { Manager, Player } from "lavaclient";
import { RESTPlugin } from "lavaclient-rest-plugin";
import { Kyflx } from "../../Client";
import { MusicUtil, Playlist, Queue, Result, Song, SongSource } from "./lib";
import * as S from "./sources";

interface Source {
  source?: any;
  song: any;
  playlist?: any;
}

Manager.use(new RESTPlugin());

export class MusicHelper extends Manager {
  #sources: Collection<string, Source>;

  public constructor(public kyflx: Kyflx) {
    super(Config.getInstance().get("audio.lavalink-nodes"), {
      send(id, payload) {
        const guild = kyflx.guilds.cache.get(id);
        if (guild) return guild.shard.send(payload);
        return;
      },
      player: class KyflxPlayer extends Player {
        public queue = new Queue(this);
      },
    });

    this.#sources = new Collection([
      ["spotify", { source: S.SpotifySongSource, song: S.SpotifySong }],
      ["youtube", { song: S.YoutubeSong, playlist: S.YoutubePlaylist }],
      ["soundcloud", { song: S.SoundcloudSong }],
    ]);
  }

  public get sources(): typeof SongSource[] {
    return this.#sources.reduce(
      (o, s) => (s.source ? o.concat(s.source) : o),
      []
    );
  }

  public async tracks(
    identifier: string
  ): Promise<
    (Track & { searchResult: boolean }) | typeof SongSource | boolean
  > {
    const source = this.sources.find((s) => s.find(identifier));
    if (source) return source;

    const res = await this.resolve(identifier);

    if (!res) return false;
    if (
      ["LOAD_FAILED", "NO_MATCHES"].includes(res.loadType) ||
      !res.tracks.length
    )
      return res.loadType !== "LOAD_FAILED";

    const songs = res.tracks as any;
    songs.searchResult = res.loadType === "SEARCH_RESULT";
    return songs;
  }

  public async load<T = Song | Playlist>(
    identifier: string
  ): Promise<Result<T>> {
    const _ = (await this.tracks(identifier)) as any;
    if (_ && Object.getPrototypeOf(_) === SongSource) {
      return Result.provide(await _.load(this.kyflx, identifier));
    }

    if (_ && _.length > 0) {
      const result = new Result<T>();
      if (_.searchResult || _.length === 1) {
        const [song] = _,
          source = (song.info.source = MusicUtil.getSource(song.info));

        switch (source) {
          case "soundcloud":
            return result.set(await new S.SoundcloudSong(song).load());
          case "youtube":
            return result.set(
              await new S.YoutubeSong(song).load(this.kyflx.apis.api("youtube"))
            );
          default:
            return result.set(new Song(song).load());
        }
      } else {
        const info = MusicUtil.getPlaylist(identifier);
        switch (info.source) {
          case "youtube":
            return result.set(
              await new S.YoutubePlaylist(info, _.tracks).load(
                this.kyflx.apis.api("youtube")
              )
            );
          default:
            return result.set(new Playlist(info, _.tracks));
        }
      }
    }

    return new Result();
  }
}
