import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";
import { CaseEdit } from ".";

@Entity("case")
export default class CaseEntity extends BaseEntity {
  @PrimaryColumn()
  public id: number = Number(0);
  @PrimaryColumn("text")
  public guildId: string = "0";

  @Column("json", { nullable: true })
  public other: Record<string, any> = {};
  @Column("simple-array")
  public edited: Array<CaseEdit> = [];

  @Column()
  public subject: string = "";
  @Column()
  public moderator: string = "";
  @Column()
  public reason: string = "None given.";
  @Column()
  public type:
    | "mute"
    | "unmute"
    | "ban"
    | "purge"
    | "kick"
    | "lockdown"
    | "slowmode"
    | "warn"
    | "roleAdd"
    | "roleRemove";

  public constructor(id: number, guildId: string, other?: Record<string, any>) {
    super();

    this.id = id;
    this.guildId = guildId;
    this.other = other;
  }
}
