import { Signale } from "signale";
import { Video } from "popyt";

import { Kyflx } from "../../../Client";

type HandlerObj = { regex: RegExp | RegExp[]; fn: (...args: any[]) => any };

const find = (regex: RegExp | RegExp[], identifier: string) =>
  Array.isArray(regex) ? regex.find((r) => r.test(identifier)) : regex;
export class SongSource {
  public static Logger = new Signale({ scope: "song sources" })

  public static find(identifier: string): HandlerObj {
    return this.handlers.find(({ regex }) => !!find(regex, identifier));
  }

  public static async load(client: Kyflx, identifier: string) {
    try {
      const res = this.find(identifier);
      const { fn, regex } = res;
      return await fn(find(regex, identifier).exec(identifier), client);
    } catch (error) {
      SongSource.Logger.error(error);
      return null;
    }
  }

  public static get handlers(): HandlerObj[] {
    return [];
  }

  public static async closestTitle(
    client: Kyflx,
    title: string
  ): Promise<Video> {
    return (await client.apis.api("youtube").search<Video>(title, 5))[0];
  }
}
