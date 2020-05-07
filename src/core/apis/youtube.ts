import YouTube, { Video, Playlist } from "popyt";
import { APIWrapper, APIWrapperOptions } from "@kyflx-dev/util";
import { Response } from "node-fetch";
import { Init } from "../../lib";

@Init<APIWrapperOptions>({})
export default class YTAPI extends APIWrapper {
  #youtube = new YouTube(config.get("apis.youtube"));

  /**
   * Get a YouTube Video.
   * @param resolvable - Video URL or ID.
   */
  public video(resolvable: string): Promise<Video> {
    return this.#youtube.getVideo(resolvable);
  }

  /**
   * Get a YouTube Playlist.
   * @param resolvable - Playlist URL or ID.
   * @param fetch - Whether to fetch the full playlist.
   */
  public async playlist(resolvable: string, fetch?: boolean): Promise<Playlist> {
    const playlist = await this.#youtube.getPlaylist(resolvable);
    if (fetch) await playlist.fetch()
    return playlist;
  }

  /**
   * Search for YouTube Videos and Playlists.
   * @param query - Search Query.
   * @param limit - How many items to search for.
   */
  public async search<T>(query: string, limit: number = 10): Promise<T[]> {
    const {
      results
    } = await this.#youtube.search([Playlist, Video], query, limit);
    return results as any;
  }
}
