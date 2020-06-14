import * as Lava from "@kyflx-dev/lavalink-types";
import { Manager, Socket } from "lavaclient";
import fetch, { RequestInit } from "node-fetch";
import { URLSearchParams } from "url";

export class REST {
  public manager: Manager;

  public constructor(public socket: Socket) {
    this.manager = socket.manager;
  }

  /**
   * Load lavaplayer tracks.
   * @param identifier - Search identifier.
   */
  public resolve(identifier: string): Promise<Lava.LoadTrackResponse> {
    return this.make(`/loadtracks?${new URLSearchParams({ identifier })}`)
      .then((r) => r.json())
      .catch((e) => this.manager.emit("error", e, this.socket.id));
  }

  /**
   * Decode a lavaplayer track into Track Info.
   * @param track - The base64 lavaplayer track.
   * @since Lavalink v1
   */
  public decode(track: string): Promise<Lava.TrackInfo> {
    return this.make(`/decodetrack?${new URLSearchParams({ track })}`)
      .then((r) => r.json())
      .catch((e) => this.manager.emit("error", e, this.socket.id));
  }

  /**
   * Route Planner - Returns the route planner status.
   * @since Lavalink v3.2.2
   */
  public routePlannerStatus(): Promise<Lava.RoutePlanner> {
    return this.make("/routeplanner/status")
      .then((r) => r.json())
      .catch((e) => this.manager.emit("error", e, this.socket.id));
  }

  /**
   * Route Planner - Unmark a failing address.
   * @param address - The failing address.
   * @since Lavalink v3.2.2
   */
  public unmarkFailingAddress(address: string): Promise<void> {
    return this.make("/routeplanner/free/address", {
      method: "post",
      body: JSON.stringify({ address }),
    })
      .then((r) => r.json())
      .catch((e) => this.manager.emit("error", e, this.socket.id));
  }

  /**
   * Route Planner - Unmark all failing addresses.
   * @since v3.2.2
   */
  public unmarkAllFailingAddresses(): Promise<void> {
    return this.make("/routeplanner/free/all", { method: "post" })
      .then((r) => r.json())
      .catch((e) => this.manager.emit("error", e, this.socket.id));
  }

  private make(endpoint: string, options: RequestInit = {}) {
    return fetch(`http://${this.socket.host}:${this.socket.port}${endpoint}`, {
      ...options,
      headers: {
        Authorization: this.socket.password,
      },
    });
  }
}
