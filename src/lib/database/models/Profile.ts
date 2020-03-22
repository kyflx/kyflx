import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export default class ProfileEntity extends BaseEntity {
  @PrimaryColumn("text")
  public userId: string = "0";
  @PrimaryColumn("text")
  public guildId: string = "0";

  @Column()
  public coins: number = 0;
  @Column()
  public xp: number = 0;
  @Column()
  public level: number = 1;
  @Column("json")
  public last: { daily: number; weekly: number } = {
    daily: 0,
    weekly: 0
  };
  @Column()
  public bank: number = 0;
  @Column("json")
  public upgrades: {
    bank: number;
    maxGamble: number;
    boosters: { gamble: number; xp: number };
  } = {
    bank: 1000,
    maxGamble: 500,
    boosters: { gamble: 1, xp: 1 }
  };
  @Column()
  public warns: number = 0;

  public constructor(userId: string, guildId: string) {
    super();

    this.userId = userId;
    this.guildId = guildId;
  }

  public add(key: "coins" | "xp" | "level", amount: number) {
    this[key] += amount;
    this.save().catch();
  }
}
