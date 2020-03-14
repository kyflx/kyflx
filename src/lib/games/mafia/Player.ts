import { MafiaGame, MafiaRole } from "./Game";

export class MafiaPlayer {
  public killed: boolean = false;
  public savedself: boolean = false;
  public killedon: number;

  public constructor(
    public game: MafiaGame,
    public id: string,
    public role: MafiaRole
  ) {}

  public toJSON() {
    return {
      killed: this.killed,
      killedon: this.killedon,
      id: this.id,
      role: this.role
    };
  }
}
