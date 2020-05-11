import { DecodedSong, Song } from "../helpers";
import { Message } from "discord.js";
import { Util as Util1 } from "@kyflx-dev/util";

export abstract class Util extends Util1 {
  public static humanify(perms: string[]): string[] {
    return perms.map((perm) =>
      perm
        .split("_")
        .map((p) => p.replace(/(\b\w)/gi, (lc) => lc.toUpperCase()))
        .join(" ")
    );
  }

  public static decodeSong(song: string): DecodedSong {
    return JSON.parse(Buffer.from(song, "base64").toString("ascii"));
  }

  public static encodeSong(song: Song): string {
    return Buffer.from(JSON.stringify(song)).toString("base64");
  }

  public static progressBar(percent: number, length = 20) {
    let str = "";
    for (let i = 0; i < length; i++) {
      if (i === Math.round(percent * length)) str += "▬";
      else str += "―";
    }
    return str;
  }

  public static playerEmbed(message: Message) {
    const np = this.decodeSong(message.queue.np.song);
    return `${Util.progressBar(
      message.player.state.position / Number(np.length)
    )} \`[${Util.formatTime(message.player.state.position)}/${Util.formatTime(
      Number(np.length)
    )}]\``;
  }

  public static formatTime(duration: number) {
    const minutes = Math.floor(duration / 60000);
    const seconds = Number(((duration % 60000) / 1000).toFixed(0));
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  }
}
