import * as Lava from "@kyflx-dev/lavalink-types";
import axios, { AxiosInstance } from "axios";
import { Manager, Socket } from "lavaclient";

export class REST {
  #axios: AxiosInstance;
  public manager: Manager;

  public constructor(public socket: Socket) {
    this.manager = socket.manager;
    this.#axios = axios.create({
      baseURL: `http://${socket.host}:${socket.port}`,
      headers: {
        authorization: socket.password,
      },
    });
  }

  /**
   * Load lavaplayer tracks.
   * @param identifier - Search identifier.
   */
  public resolve(identifier: string): Promise<Lava.LoadTrackResponse> {
    return this.#axios
      .get("/loadtracks", { params: { identifier } })
      .then((r) => r.data)
      .catch((e) => this.manager.emit("error", e, this.socket.name));
  }

  /**
   * Decode a lavaplayer track into Track Info.
   * @param track - The base64 lavaplayer track.
   * @since Lavalink v1
   */
  public decode(track: string): Promise<Lava.TrackInfo> {
    return this.#axios
      .get("/decodetrack", { params: { track } })
      .then((r) => r.data)
      .catch((e) => this.manager.emit("error", e, this.socket.name));
  }

  /**
   * Route Planner - Returns the route planner status.
   * @since Lavalink v3.2.2
   */
  public routePlannerStatus(): Promise<Lava.RoutePlanner> {
    return this.#axios
      .get("/routeplanner/status")
      .then((r) => r.data)
      .catch((e) => this.manager.emit("error", e, this.socket.name));
  }

  /**
   * Route Planner - Unmark a failing address.
   * @param address - The failing address.
   * @since Lavalink v3.2.2
   */
  public unmarkFailingAddress(address: string): Promise<void> {
    return this.#axios
      .post("/routeplanner/free/address", { address })
      .then((r) => r.data)
      .catch((e) => this.manager.emit("error", e, this.socket.name));
  }

  /**
   * Route Planner - Unmark all failing addresses.
   * @since v3.2.2
   */
  public unmarkAllFailingAddresses(): Promise<void> {
    return this.#axios
      .post("/routeplanner/free/all")
      .then((r) => r.data)
      .catch((e) => this.manager.emit("error", e, this.socket.name));
  }
}
