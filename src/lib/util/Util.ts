export abstract class Util {
  public static humanify(perms: string[]): string[] {
    return perms.map((perm) =>
      perm
        .split("_")
        .map((p) => p.replace(/(\b\w)/gi, (lc) => lc.toUpperCase()))
        .join(" ")
    );
  }
}
