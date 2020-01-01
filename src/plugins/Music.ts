import Logger from "@ayana/logger";
import {
  ClientPlugin,
  Config,
  ICommandOptions,
  GuildEntity
} from "@vortekore/lib";
import WebSocket from "ws";
import ms from "ms";

export default class Verta extends ClientPlugin {
  public name: string = "music";
  public players: string[] = [];
  public ping: number = 0;
  public commands: (ICommandOptions & { name: string })[] = [];

  private logger: Logger = Logger.get(Verta);
  private ws: WebSocket;

  public onReady() {
    this.ws = new WebSocket(`ws://${Config.get("node_host", false)}:4269`);

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
          break;
        case "players":
          this.players = this.players.concat(...data.d);
          break;
        case "pong":
          this.ping = data.d.ping;
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

  public getPing(): Promise<void> {
    if (!this.ws) throw new Error("Music WS isn't opened");
    return Promise.resolve(
      this.ws.send(
        JSON.stringify({
          op: "ping"
        })
      )
    );
  }

  public updateGuild(entity: GuildEntity) {
    this.ws.send(
      JSON.stringify({
        op: "update-guild",
        d: entity
      })
    );
  }

  public async queueReconnect(code: number, reason: string) {
    this.logger.info(`[${code}] Reconnecting to Verta: "${reason}"`);
    try {
      await this.onReady();
    } catch (e) {
      this.logger.info(e.message);
      setInterval(() => this.queueReconnect(code, reason), ms("1m"));
    }
  }
}
