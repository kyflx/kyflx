import fetch, { RequestInit } from "node-fetch";
import { APIWrapper, APIWrapperOptions } from "@kyflx-dev/util";
import { URLSearchParams } from "url";
import { Init } from "../../lib";

export interface BotsQuery extends Record<string, any> {
  sort?: keyof Bot;
  search?: string;
  fields?: string;
  limit?: number;
  offset?: number;
}

@Init<APIWrapperOptions>({ url: "https://top.gg/api" })
export default class DBLAPI extends APIWrapper {
  public bot(id: string): Promise<Bot> {
    return new Promise((done) =>
      this.request(`/bots/${id}`)
        .then((res) => done(res.json()))
        .catch((err) => this.logger.error(err))
    );
  }

  public stats(id: string): Promise<BotStats> {
    return new Promise((done) =>
      this.request(`/bots/${id}/stats`)
        .then((res) => done(res.json()))
        .catch((err) => this.logger.error(err))
    );
  }

  public bots(options: BotsQuery = {}): Promise<Bot> {
    const query = new URLSearchParams(options);
    return new Promise((done) =>
      this.request(`/bots?${query}`)
        .then((res) => done(res.json()))
        .catch((err) => this.logger.error(err))
    );
  }

  public postStats(servers: number) {
    return new Promise((done) => {
      return this.request(`/bots/${this.client.user.id}/stats`, {
        method: "post",
        body: JSON.stringify({
          server_count: servers,
        }),
      })
        .then(() => done(true))
        .catch((err) => this.logger.error(err));
    });
  }

  private request(endpoint: string, init: RequestInit = {}) {
    return fetch(`${this.BASE_URL}/${endpoint}`, {
      ...init,
      headers: {
        ...(init.headers ?? {}),
        authorization: config.get("apis.dbl"),
        "User-Agent": "Kyflx Discord Bot (NodeJS, v3.0.0)",
        "Content-Type": "application/json",
      },
    });
  }
}

export interface BotStats {
  server_count: number;
  shards: number[];
  shard_count?: number;
}

export interface Bot {
  defAvatar: string;
  invite: string;
  website: string;
  support: string;
  github: string;
  longdesc: string;
  shortdesc: string;
  prefix: string;
  lib: string;
  clientid: string;
  avatar: string;
  id: string;
  discriminator: string;
  username: string;
  date: string;
  server_count: number;
  guilds: string[];
  shards: any[];
  monthlyPoints: number;
  points: number;
  certifiedBot: boolean;
  owners: string[];
  tags: string[];
  donatebotguildid: string;
}
