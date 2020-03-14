import { MafiaGame } from "./Game";

export interface MafiaPlayerMove {
  type: "kill" | "save" | "investigation";
  subject: string;
  result?: any;
}

export class MafiaNight {
  public investigated: { target: string; mafia: boolean };
  public saved: string;
  public killed: string;

  public constructor(public game: MafiaGame, public count: number) {}

  public kill(id: string) {
    const player = this.game.getPlayer(id);
    if (!player) throw new Error("Player doesn't exist.");

    player.killed = true;
    player.killedon = this.count;
    this.killed = id;

    return;
  }

  public save(id: string) {
    const player = this.game.getPlayer(id);
    if (!player) throw new Error("Player doesn't exist.");

    if ((this.killed = id)) {
      player.killed = false;
      delete player.killedon;
    }

    this.saved = id;

    return;
  }

  public investigate(id: string): boolean {
    const player = this.game.getPlayer(id);
    if (!player) throw new Error("Player doesn't exist.");

    const result: boolean = player.role === "mafia" ? true : false;
    this.investigated = { target: id, mafia: result };

    return result;
  }

  public toJSON() {
    return {
      investigated: this.investigated,
      saved: this.killed,
      killed: this.killed
    };
  }
}
