import { APIWrapper, APIWrapperOptions } from "@kyflx-dev/util";
import fetch, { RequestInit } from "node-fetch";
import { URLSearchParams } from "url";
import { Init } from "../../lib";
import { Imgur, Subreddit } from "../../types";

type FilterTypes = "hot" | "new" | "top" | "front";

interface SubredditOptions {
  filter?: FilterTypes;
  limit?: number;
}

@Init<APIWrapperOptions>({ name: "imgdit" })
export default class RedditAPI extends APIWrapper {
  public imgur(
    name: string,
    { limit = 100 }: SubredditOptions = {}
  ): Promise<Imgur[]> {
    return this.request(
      `https://imgur.com/r/${name}/hot.json?${new URLSearchParams({
        limit: limit.toString(),
      })}`
    )
      .then((res) => res.json())
      .then((res) => res.data)
      .catch((err) => this.logger.error(err));
  }

  public subreddit(
    name: string,
    { filter = "front", limit = 100 }: SubredditOptions = {}
  ): Promise<Subreddit[]> {
    const end = filter === `front` ? `${name}.json` : `${name}/${filter}.json`;
    return this.request(
      `https://reddit.com/r/${end}?${new URLSearchParams({
        limit: limit.toString(),
      })}`
    )
      .then((res) => res.json())
      .then((res) => res.data.children)
      .catch((err) => this.logger.error(err));
  }

  private request(endpoint: string, init?: RequestInit) {
    return fetch(`${this.BASE_URL}${endpoint}`, {
      ...init,
      headers: {
        ...(init ?? {}).headers,
        "User-Agent": "Kyflx Discord Bot (NodeJS, v3.0.0)",
        "Content-Type": "application/json",
      },
    });
  }
}
