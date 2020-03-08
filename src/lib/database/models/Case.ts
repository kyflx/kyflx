import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";
import { Snowflake } from "discord.js";
import { CaseEdit } from ".";

@Entity()
export default class CaseEntity extends BaseEntity {
  @ObjectIdColumn() private _id!: ObjectID;

  @Column() public id = Number(0);
  @Column() public guildId: Snowflake;

  @Column() public other: Record<string, any>;
  @Column() public edited: CaseEdit[] = [];

  @Column() public subject: any = "";
  @Column() public moderator: Snowflake = "";
  @Column() public reason = "None given.";
  @Column() public type:
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

  public constructor(
    id: number,
    guildId: Snowflake,
    other?: Record<string, any>
  ) {
    super();

    this.id = id;
    this.guildId = guildId;
    this.other = other;
  }
}
