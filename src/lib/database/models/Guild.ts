import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";
import { Snowflake } from "discord.js";
import {
  ReactionMenu,
  GuildEntityChannels,
  GuildLogsMap,
  WarnPunishment,
  VerifySettings
} from ".";

@Entity()
export default class GuildEntity extends BaseEntity {
  @Column() public guildId: Snowflake;

  @Column() public cases = Number(0);
  @Column() public lvlUpChannel: Snowflake = "";
  @Column() public lvlUpMsg: boolean = true;
  @Column() public prefixes: string[] = ["v!"];
  @Column() public language: string = "en_US";
  @Column() public embedColor: number = 814543;

  @Column() public djRole: Snowflake = "";
  @Column() public muteRole: Snowflake = "";
  @Column() public reactionRoles: Record<Snowflake, ReactionMenu> = {};
  @Column() public autoRoles: Snowflake[] = [];
  @Column() public warnPunishments: Record<number, WarnPunishment> = {};
  @Column() public verification: VerifySettings;

  @Column() public welcomeMessage =
    "Welcome **{{mention}}** to **{{server}}**!\n\n**{{server}}** now has {{memberCount}} members!";
  @Column() public farewellMessage =
    "Goodbye **{{mention}}**, **{{server}}** says farewell!\n\n**{{server}}** now has {{memberCount}} members!";

  @Column() public channels: GuildEntityChannels = {
    member: "",
    audit: ""
  };
  @Column() public logs: GuildLogsMap = {
    messageDelete: false,
    messageUpdate: false,
    ban: true,
    kick: true,
    mute: true,
    warn: true,
    lockdown: true,
    slowmode: false,
    roleRemove: false,
    roleAdd: false,
    purge: false,
    memberJoined: "",
    memberLeave: ""
  };
  @ObjectIdColumn() private _id!: ObjectID;

  public constructor(guildId: Snowflake) {
    super();

    this.guildId = guildId || this.guildId;
  }

  public log(
    log: keyof GuildLogsMap,
    chan: keyof GuildEntityChannels
  ): { channel: Snowflake; enabled: boolean } {
    const channel = this.channels[chan];
    const enabled = !!this.logs[log];
    return { channel, enabled };
  }
}
