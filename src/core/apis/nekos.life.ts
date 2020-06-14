import { APIWrapper, APIWrapperOptions } from "@kyflx-dev/util";
import { Init } from "../../lib";
import fetch from "node-fetch";
import { URLSearchParams } from "url";

const types = [ "baka", "cuddle", "feed", "fox_girl", "holo", "hug", "kemonomimi", "kiss", "lizard", "neko", "ngif", "pat", "poke", "slap", "smug", "tickle" ]

@Init<APIWrapperOptions>({ url: "https://nekos.life/api/v2", name: "nekos" })
export default class NekosLifeAPI extends APIWrapper {
  public get fact(): Promise<string> {
    return this.request(`/fact`)
      .then((res) => res.json())
      .then((res) => res.fact)
      .catch((error) => this.logger.error(error));
  }

  public get "8ball"(): Promise<{ response: string; url: string }> {
    return this.request("/8ball")
      .then((res) => res.json())
      .catch((error) => this.logger.error(error));
  }

  public async init() {
    types.forEach((type) => {
      Object.defineProperty(this, type, {
        get(this: NekosLifeAPI) {
          return this.request(`/img/${type}`)
            .then((res) => res.json())
            .then((res) => res.url)
            .catch((err) => this.logger.error(err));
        },
      });
    });
  }

  public owoify(text: string): Promise<string> {
    return this.request(`/owoify?${new URLSearchParams({ text })}`)
      .then((res) => res.json())
      .then((res) => res.owo)
      .catch((err) => this.logger.error(err));
  }

  private request(endpoint: string) {
    return fetch(`${this.BASE_URL}${endpoint}`, {
      headers: {
        "User-Agent": "Kyflx Discord Bot [github.com/kyflx] (NodeJS, v3.0.0)",
        "Content-Type": "application/json",
      },
    });
  }
}

export interface NekosLife extends Record<ImgTypes, string> {
  "8ball": Promise<{ response: string; url: string }>;

  owoify(text: string): Promise<string>;
}
