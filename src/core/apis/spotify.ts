import fetch, { RequestInit, Response } from "node-fetch";
import { APIWrapper, APIWrapperOptions } from "@kyflx-dev/util";

import { Track, Album, Playlist, Artist } from "../../types";
import { URLSearchParams } from "url";
import { Init } from "../../lib";

interface Token {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  expiresAt: Date;
}

@Init<APIWrapperOptions>({ url: "https://api.spotify.com/v1" })
export default class SpotifyAPI extends APIWrapper {
  #token: Token;

  public ratelimited = false;
  public retryAfter: number = 0;

  public async init() {
    await this.getToken();
  }

  /**
   * Search for tracks on spotify.
   * @param q - Search query.
   * @param limit - The amount of tracks to search for.
   */
  public tracks(q: string, limit: number = 20): Promise<Track[]> {
    return this.search(q, "track", limit)
      .catch((err) => this.logger.error(err))
      .then((res) =>
        res.tracks && res.tracks.total > 0 ? res.tracks.items : []
      );
  }

  /**
   * Search for Spotify Albums.
   * @param q - What to search for.
   * @param limit - The amount of albums to search for.
   */
  public albums(q: string, limit: number = 20): Promise<Album[]> {
    return this.search(q, "album", limit)
      .catch((err) => this.logger.error(err))
      .then((res) =>
        res.albums && res.albums.total > 0 ? res.albums.items : []
      );
  }

  /**
   * Search for Spotify Artists.
   * @param q - Artists to search for.
   * @param limit - The amount of artists to search for.
   */
  public artists(q: string, limit: number = 20): Promise<Artist[]> {
    return this.search(q, "artist", limit)
      .catch((err) => this.logger.error(err))
      .then((res) =>
        res.artists && res.artists.total > 0 ? res.artists.items : []
      );
  }

  public playlists(q: string, limit: number = 20): Promise<Playlist[]> {
    return this.search(q, "playlist", limit)
      .catch((err) => this.logger.error(err))
      .then((res) =>
        res.playlists && res.playlists.total > 0 ? res.playlists.items : []
      );
  }

  /**
   * Fetch a Spotify Track from it's ID.
   * @param id - The track id.
   */
  public track(id: string): Promise<Track> {
    return this.request(`/tracks/${id}`)
      .then((res) => res.json())
      .catch((err) => this.logger.error(err));
  }

  /**
   * Fetch a Spotify Playlist from it's ID
   * @param id - The playlist id.
   */
  public playlist(id: string): Promise<Playlist> {
    return this.request(`/playlists/${id}`)
      .then((res) => res.json())
      .catch((err) => this.logger.error(err));
  }

  /**
   * Fetch a Spotify 
   * @param id - The artists id.
   */
  public artist(id: string): Promise<Artist> {
    return this.request(`/artists/${id}`)
      .then((res) => res.json())
      .catch((err) => this.logger.error(err));
  }

  /**
   * Fetch a 
   * @param id - The album ID.
   */
  public album(id: string): Promise<Album> {
    return this.request(`/albums/${id}`)
      .then((res) => res.json())
      .catch((err) => this.logger.error(err));
  }

  public artistAlbums(
    id: string,
    limit = 50,
    include = ["album", "single"]
  ): Promise<Album[]> {
    const params = new URLSearchParams({
      limit: limit.toString(),
      include_groups: include.join(),
    });
    return this.request(`/artists/${id}/albums?${params}`)
      .then((res) => res.json())
      .catch((err) => this.logger.error(err));
  }

  public search(q: string, type: string, limit: number = 20) {
    const params = new URLSearchParams({ q, type, limit: limit.toString() });
    return this.request(`/search?${params}`)
      .then((res) => res.json())
      .then((u) => (u && u.data ? u.data[0] : u));
  }

  public request(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> {
    return new Promise(async (done, rej) => {
      if (this.ratelimited) return rej("ratelimited");
      if (this.tokenExpired) await this.getToken();

      return fetch(`${this.BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...(this.headers ?? {}),
          "User-Agent": "Kyflx Discord Bot (NodeJS, v3.0.0)",
          "Content-Type": "application/json",
        },
      }).then((res) => {
        if (res.status === 429) {
          this.ratelimited = true;
          setTimeout(
            () => (this.ratelimited = false),
            +res.headers.get("Retry-After")
          );
          return done({ json: (): any => ({ ratelimited: true }) } as any);
        }

        return done(res);
      });
    });
  }

  public getToken() {
    return fetch(
      `https://accounts.spotify.com/api/token?grant_type=client_credentials`,
      {
        method: "post",
        headers: this.credentialHeaders,
      }
    )
      .then((res) => res.json())
      .then((body) => {
        const { access_token, expires_in, token_type } = body as any;

        this.#token = {
          accessToken: access_token,
          expiresIn: expires_in,
          tokenType: token_type,
          expiresAt: new Date(
            new Date().getTime() + (expires_in - 2000) * 1000
          ),
        };
      });
  }

  private get tokenExpired() {
    // @ts-ignore
    return this.#token ? this.#token.expiresAt - new Date() <= 0 : true;
  }

  private get headers() {
    return this.#token
      ? {
          Authorization: `${this.#token.tokenType} ${this.#token.accessToken}`,
        }
      : {};
  }

  private get credentialHeaders() {
    const credential = Buffer.from(
      `${config.get("apis.spotify.id")}:${config.get("apis.spotify.secret")}`
    ).toString("base64");
    return {
      Authorization: `Basic ${credential}`,
      "Content-Type": "application/x-www-form-urlencoded",
    };
  }
}
