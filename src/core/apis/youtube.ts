import { APIWrapper, APIWrapperOptions, Config } from "@kyflx-dev/util";
import fetch, { RequestInit } from "node-fetch";
import { URLSearchParams } from "url";
import { Init, YoutubePlaylist } from "../../lib";
import { SearchResult, YoutubeVideo } from "../../types/apis/youtube";

@Init<APIWrapperOptions>({ url: "https://www.googleapis.com/youtube/v3" })
export default class YTAPI extends APIWrapper {
  /**
   * Get a YouTube Video.
   * @param id - Video URL or ID.
   */
  public async video(id: string): Promise<YoutubeVideo> {
    const results = await this.request("/videos", {
      part: "snippet",
      id,
    });

    return results.items[0];
  }

  /**
   * Get a YouTube Playlist.
   * @param resolvable - Playlist URL or ID.
   * @param fetch - Whether to fetch the full playlist.
   */
  public async playlist(id: string): Promise<YoutubePlaylist> {
    return this.request("/videos", {
      part: "snippet",
      id,
    });
  }

  /**
   * Search for YouTube Videos and Playlists.
   * @param query - Search Query.
   * @param limit - How many items to search for.
   */
  public async search(
    query: string,
    limit: number = 10
  ): Promise<SearchResult> {
    const result: SearchResult = await this.request("/search", {
      maxResults: limit,
      q: query,
      part: [ "snippet" ],
      type: [ "video", "playlist" ],
    });

    return result;
  }

  public request(
    endpoint: string,
    query: Record<string, any> = {},
    options: RequestInit = {}
  ) {
    Object.assign(query, { key: Config.getInstance().get("apis.youtube") });
    return fetch(
      `${this.BASE_URL}${endpoint}?${new URLSearchParams(query)}`,
      Object.assign(options, {
        headers: {
          "User-Agent": "Kyflx Discord Bot (NodeJS, v3.0.0)",
        },
      })
    ).then((res) => res.json());
  }
}
