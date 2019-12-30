import { ClientPlugin, Command, ICommandOptions } from "@vortekore/lib";
import WebSocket from "ws";
import Logger from "@ayana/logger";

export default class Communicator extends ClientPlugin {
  public name: string = "music";
  public players: string[] = [];
  public ping: number = 0;
  public commands: (ICommandOptions & { name: string })[] = []

  private logger: Logger = Logger.get(Communicator);
  private ws: WebSocket;

  public onReady() {
    this.ws = new WebSocket("ws://localhost:4269", {
      headers: {
        Authorization: this.client.token
      }
    });

    this.ws.on("open", () => this.logger.info("Music is Online!"));
    this.ws.on("message", msg => {
      let data: { op: string; d: any };
      try {
        data = JSON.parse(msg.toString());
      } catch (error) {
        return this.logger.error(error);
      }

      switch (data.op) {
        case "metadata":
          this.players.concat(...data.d.players);
          this.ping = data.d.ping;
          this.commands.push(...data.d.commands);
          break;
        case "players":
          this.players.concat(...data.d);
          break;
        case "pong":
          this.ping = data.d.ping;
          break;
      }
    });
  }

  public getPlayers(): void {
    if (!this.ws) throw new Error("Music WS isn't opened");
    return this.ws.send(
      JSON.stringify({
        op: "players"
      })
    );
  }

  public getPing(): Promise<void> {
    if (!this.ws) throw new Error("Music WS isn't opened");
    return Promise.resolve(this.ws.send(
      JSON.stringify({
        op: "ping"
      })
    ));
  }
}
