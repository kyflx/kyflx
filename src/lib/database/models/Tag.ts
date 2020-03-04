import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";
import { Snowflake } from "discord.js";

@Entity()
export default class TagEntity extends BaseEntity {
  @Column() public guildId: Snowflake;
  @Column() public author: Snowflake;
  @Column() public content: string;
  @Column() public createdAt: Date = new Date();
  @Column() public aliases: string[] = [];
  @Column({ unique: true }) public name: string;
  @ObjectIdColumn() private _id: ObjectID;
}
