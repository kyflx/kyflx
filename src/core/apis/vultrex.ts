import { APIWrapper, APIWrapperOptions } from "@kyflx-dev/util";
import { Init } from "../../lib";
import fetch, { RequestInit } from "node-fetch";

@Init<APIWrapperOptions>({ url: "https://api.vultrex.io/v2/vapi" })
export default class VultrexAPI extends APIWrapper {
  public postStats(servers: number) {
    return this.request("/server-count", {
      method: "post",
      body: JSON.stringify({
        serverCount: servers,
        bot: this.client.user.id,
      }),
    })
      .then(() => true)
      .catch((error) => this.logger.error(error));
  }

  public request(endpoint: string, options: RequestInit = {}) {
    return fetch(`${this.BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...(options.headers ?? {}),
        authorization: config.get("apis.vultrex"),
        "User-Agent": "Kyflx Discord Bot (NodeJS, v3.0.0)",
        "Content-Type": "application/json",
      },
    });
  }
}
