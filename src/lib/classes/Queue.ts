import { EventEmitter } from "events";
import { Player } from "lavalink";
import EmitterHook from "./Hook";

export interface NowPlaying {
  position?: number;
  song?: string & { requester?: string };
  skips: Set<string>;
}

export interface Repeat {
  queue: boolean;
  song: boolean;
}

export default class Queue extends EventEmitter {
  public next: string[] = [];
  public previous: string[] = [];
  public repeat: Repeat = { queue: false, song: false };
  public np: NowPlaying = { position: 0, skips: new Set() };
  public hook: EmitterHook;

  public constructor(public readonly player: Player) {
    super();

    this.player.queue = this;
    this.player
      .on("event", async (d: { [key: string]: any }) => {
        if (
          d.type !== "TrackEndEvent" ||
          !["REPLACED", "STOPPED"].includes(d.reason)
        ) {
          if (!this.repeat.song) this._next();
          if (this.repeat.queue && !this.np.song) {
            const previous = this.previous.reverse();
            this.clear();
            this.add(...previous);
            this._next();
          }

          if (!this.np.song) return this.emit("finish");
          this.emit("next", this.np);
          await this.player.play(this.np.song);
        }
      })
      .on("playerUpdate", d => {
        this.np.position = d.state.position;
      });
  }

  public add(...songs: string[]): number {
    if (!songs.length) return 0;
    return this.next.push(...songs);
  }

  public async _next() {
    const next = this.next.shift();
    if (this.np.song) this.previous.unshift(this.np.song);
    this.np = { song: next, position: 0, skips: new Set() };
  }

  public async start(): Promise<boolean> {
    if (!this.np.song) this._next();
    await this.player.play(this.np.song!);
    return this.emit("start", this.np);
  }

  public stop(): Promise<void> {
    return this.player.stop();
  }

  public setVolume(vol: number): Promise<void> {
    this.player.volume = vol;
    return this.player.setVolume(vol);
  }

  public async move(from: number, to: number): Promise<string[]> {
    if (to >= this.next.length) {
      let k = to - this.next.length + 1;
      while (k--) {
        this.next.push(<any>undefined);
      }
    }

    this.next.splice(to, 0, this.next.splice(from, 1)[0]);
    return this.next;
  }

  public length(): number {
    return this.next.length;
  }

  public sort(predicate?: (a: string, b: string) => number): string[] {
    return this.next.sort(predicate);
  }

  public async clear(stop: boolean = false): Promise<void> {
    this.next = [];
    this.previous = [];
    this.np = { position: 0, skips: new Set() };
    if (stop) await this.stop();
  }
}
