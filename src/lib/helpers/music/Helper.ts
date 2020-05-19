import { Track } from "@kyflx-dev/lavalink-types";
import { Config } from "@kyflx-dev/util";
import { Collection } from "discord.js";
import { Extend, Manager, Plugin, Structures } from "lavaclient";
import { Kyflx } from "../../Client";
import { MusicUtil, Playlist, Queue, REST, Result, Song, SongSource } from "./lib";
import * as S from "./sources";

interface Source {
	source?: any;
	song: any;
	playlist?: any;
}

export interface DecodedSong {
	extra: Extra;
	track: string;
	identifier: string;
	seekable: boolean;
	author: string;
	length: number;
	stream: boolean;
	position: number;
	title: string;
	url: string;
	artwork: string;
}

export interface Extra extends Record<string, any> {
	color: number;
}

class KyflxMusic extends Plugin {
	public preRegister(): void {
		@Extend("socket")
		class KyflxSocket extends Structures.get("socket") {
			public rest: REST = new REST(this);
		}

		@Extend("player")
		class KyflxPlayer extends Structures.get("player") {
			public queue: Queue = new Queue(this);
		}
	}
}

export class MusicHelper extends Manager {
	#sources: Collection<string, Source>;

	public constructor(public kyflx: Kyflx) {
		super(Config.getInstance().get("audio.lavalink-nodes"), {
			send(id, payload): void {
				const guild = kyflx.guilds.cache.get(id);
				if (guild) guild.shard.send(payload);
			},
		});

		this.#sources = new Collection([
			["spotify", {source: S.SpotifySongSource, song: S.SpotifySong}],
			["youtube", {song: S.YoutubeSong, playlist: S.YoutubePlaylist}],
			["soundcloud", {song: S.SoundcloudSong}],
		]);
	}

	public get sources(): typeof SongSource[] {
		return this.#sources.reduce(
			(o, s) => (s.source ? o.concat(s.source) : o),
			[] as typeof SongSource[]
		);
	}

	public decodeSong(song: string): DecodedSong {
		return JSON.parse(Buffer.from(song, "base64").toString("ascii"));
	}

	public async tracks(
		identifier: string
	): Promise<| (Track & { searchResult: boolean })
		| typeof SongSource
		| Result<unknown>
		| boolean> {
		const source = this.sources.find((s) => s.find(identifier));
		if (source) return source;

		const res = await this.ideal[0].rest.resolve(identifier);

		if (!res) return false;
		if (
			["LOAD_FAILED", "NO_MATCHES"].includes(res.loadType) ||
			!res.tracks.length
		)
			return new Result().setError(
				res.loadType === "NO_MATCHES"
					? `No matches`
					: `${res.exception.severity}: ${res.exception.message}`
			);

		const songs = res.tracks as any;
		songs.searchResult = res.loadType === "SEARCH_RESULT";
		return songs;
	}

	public async load<T = Song | Playlist>(
		identifier: string
	): Promise<Result<T>> {
		const _ = (await this.tracks(identifier)) as any;
		if (_ instanceof Result) return _;

		if (_ && Object.getPrototypeOf(_) === SongSource) {
			return Result.provide(await _.load(this.kyflx, identifier));
		}

		if (_ && _.length > 0) {
			const result = new Result<T>();
			if (_.searchResult || _.length === 1) {
				const [song]: any = _,
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
				if (info.source === "youtube") {
					return result.set(
						await new S.YoutubePlaylist(info, _.tracks).load(
							this.kyflx.apis.api("youtube")
						)
					);
				} else {
					return result.set(new Playlist(info, _.tracks));
				}
			}
		}

		return new Result();
	}
}

MusicHelper.use(new KyflxMusic());
