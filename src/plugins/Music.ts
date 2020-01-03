import Logger from "@ayana/logger";
import { ClientPlugin, Command, Config } from "@vortekore/lib";
import ms from "ms";
import WebSocket from "ws";
import { VERTA_DEPENDENT } from '../index';

declare module "discord-akairo" {
  interface AkairoClient {
    music: Verta;
  }
}

interface Heap {
  init: number;
  used: number;
  committed: number;
  max: number;
}
interface NonHeap {
  init: number;
  used: number;
  committed: number;
  max: number;
}

interface Memory {
  pendingFinalization: number;
  heap: Heap;
  nonHeap: NonHeap;
}
export default class Verta extends ClientPlugin {
  public name: string = "music";
  public players: string[] = [];
  public ping: number = 0;
  public commands: Command[] = [];
  public stats: {
    verta: NodeJS.MemoryUsage;
    node: Memory;
  };

  private logger: Logger = Logger.get(Verta);
  private ws: WebSocket;

  public onReady() {
    if (!VERTA_DEPENDENT) return;
    this.ws = new WebSocket(`ws://${Config.get("node_host")}:4269`);

    this.ws.on("close", (code, reason) => {
      this.ws.close(4011);
      this.queueReconnect(code, reason);
    });

    this.ws.on("open", () => this.logger.info("Verta is Online!"));
    this.ws.on("message", msg => {
      let data: { op: string; d: any };
      try {
        data = JSON.parse(msg.toString());
      } catch (error) {
        return this.logger.error(error);
      }

      switch (data.op) {  
        case "metadata":
          this.ping = data.d.ping;
          this.commands = this.commands.concat(...data.d.commands);
          this.players = this.players.concat(...data.d.players);
          this.stats = {
            node: data.d.nodeUsage,
            verta: data.d.memoryUsage
          }
          break;
        case "players":
          this.players = this.players.concat(...data.d);
          break;
        case "stats":
          this.ping = data.d.ping
          this.stats = {
            node: data.d.nodeUsage,
            verta: data.d.memoryUsage
          }
          break;
      }
    });
  }

  public getPlayers(): void {
    if (!this.ws) throw new Error("Verta WS isn't opened");
    return this.ws.send(
      JSON.stringify({
        op: "players"
      })
    );
  }

  public getStats(): void {
    if (!this.ws) throw new Error("Verta WS isn't opened");
    return this.ws.send(
      JSON.stringify({
        op: "stats"
      })
    );
  }

  public async queueReconnect(code: number, reason: string) {
    this.logger.info(`[${code}] Reconnecting to Verta: "${reason}"`);
    try {
      this.ws.removeAllListeners();
      this.ws = null;
      await this.onReady();
    } catch (e) {
      this.logger.info(e.message);
      setInterval(() => this.queueReconnect(code, reason), ms("1m"));
    }
  }
}
