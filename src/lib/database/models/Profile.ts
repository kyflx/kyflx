import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";
import { Snowflake } from "discord.js";

@Entity()
export default class ProfileEntity extends BaseEntity {
  @Column({ unique: true }) public userId: Snowflake;
  @Column() public guildId: Snowflake;
  @Column() public coins: number = 0;
  @Column() public xp: number = 0;
  @Column() public level: number = 1;
  @Column() public last: { daily: number; weekly: number } = {
    daily: 0,
    weekly: 0
  };
  @Column() public bank: number = 0;
  @Column() public upgrades: {
    bank: number;
    maxGamble: number;
    boosters: { gamble: number; xp: number };
  } = {
    bank: 1000,
    maxGamble: 500,
    boosters: { gamble: 1, xp: 1 }
  };
  @Column() public warns: number = 0;
  @Column() public bio: string = "I'm a cool VorteKore user!";
  @ObjectIdColumn() private _id!: ObjectID;

  public constructor(userId: Snowflake, guildId: Snowflake) {
    super();

    this.userId = userId;
    this.guildId = guildId;
  }

  public add(key: "coins" | "xp" | "level", amount: number) {
    this[key] += amount;
    this.save().catch();
  }
}
