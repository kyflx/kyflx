import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export default class TagEntity extends BaseEntity {
  @PrimaryColumn("text")
  public guildId: string = "0";
  @PrimaryColumn()
  public name: string = "0";

  @Column()
  public author: string = "";
  @Column()
  public content: string = "";
  @Column()
  public createdAt: Date = new Date();
  @Column("simple-array")
  public aliases: Array<string> = [];
}
