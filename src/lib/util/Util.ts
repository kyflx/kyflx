import { DecodedSong, Song } from "../helpers";

export abstract class Util {
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
}
