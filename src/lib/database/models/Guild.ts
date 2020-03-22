import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

export const mafiaDefault = {
  daytime: "",
  detective: "",
  doctor: "",
  mafia: "",
  detectiveLimit: 1,
  doctorLimit: 1,
  mafiaLimit: 2,
  villagerLimit: 3,
  playerRole: "",
  moderatorRole: "",
  configured: false
};

@Entity()
export default class GuildEntity extends BaseEntity {
  @PrimaryColumn("text", { unique: true })
  public guildId: string = "0";

  @Column("jsonb", { default: () => "'{}'" })
  public settings: any;

  public constructor(guildId: string) {
    super();

    this.guildId = guildId || this.guildId;
  }
}
