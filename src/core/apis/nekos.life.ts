import { APIWrapper, APIWrapperOptions } from "@kyflx-dev/util";
import { Init } from "../../lib";
import fetch from "node-fetch";

const types = ["baka", "cuddle", "feed", "fox_girl", "holo", "hug", "kemonomimi", "kiss", "lizard", "neko", "ngif", "pat", "poke", "slap", "smug", "tickle"]

@Init<APIWrapperOptions>({ url: "https://nekos.life/api/v2", name: "nekos" })
export default class NekosLifeAPI extends APIWrapper {
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

  private request(endpoint: string) {
    return fetch(`${this.BASE_URL}${endpoint}`, {
      headers: {
        "User-Agent": "Kyflx Discord Bot (NodeJS, v3.0.0)",
        "Content-Type": "application/json",
      },
    });
  }
}

export interface NekosLife extends Record<ImgTypes, string> {}