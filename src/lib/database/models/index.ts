import { Snowflake } from "discord.js";
import { MafiaDBObject, TabooGame } from "../../games";
import { mafiaDefault } from "./Guild";

export { default as CaseEntity } from "./Case";
export { default as GuildEntity } from "./Guild";
export { default as ProfileEntity } from "./Profile";
export { default as TagEntity } from "./Tag";

export interface CaseEdit {
  date: number;
  moderation: string;
  props: string;
}

export interface GamesObject extends Record<string, {}> {
  mafia: MafiaDBObject;
  taboo?: TabooGame;
}

export interface GuildLogsMap {
  messageDelete: boolean;
  messageUpdate: boolean;
  ban: boolean;
  kick: boolean;
  mute: boolean;
  warn: boolean;
  lockdown: boolean;
  slowmode: boolean;
  roleRemove: boolean;
  roleAdd: boolean;
  purge: boolean;
  memberJoined?: string;
  memberLeave?: string;
}

export interface GuildSettings {
  /* Staff */
  warnPunishments: Record<number, WarnPunishment>;
  cases: number;
  verification: Partial<VerifySettings>;
  logs: GuildLogsMap;

  /* Basic */
  lvlUpMsg: boolean;
  announceNextTrack: boolean;
  prefixes: Array<string>;
  language: string;
  embedColor: number;

  /* Games */
  games: GamesObject;

  /* Roles */
  djRole: Snowflake;
  reactionRoles: Record<Snowflake, ReactionMenu>;
  muteRole: Snowflake;
  autoRoles: Array<Snowflake>;

  welcomeMessage: string;
  farewellMessage: string;

  channels: GuildEntityChannels;
}

export const guildDefaults: GuildSettings = {
  /* Staff */
  warnPunishments: {},
  cases: Number(0),
  verification: {},
  logs: {
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
  },

  /* Basic */
  lvlUpMsg: true,
  announceNextTrack: true,
  prefixes: ["v!"],
  language: "en_US",
  embedColor: 814543,

  /* Games */
  games: {
    mafia: mafiaDefault,
    tabbo: null
  },

  /* Roles */
  djRole: "",
  reactionRoles: {},
  muteRole: "",
  autoRoles: [],

  welcomeMessage:
    "Welcome **{{mention}}** to **{{server}}**!\n\n**{{server}}** now has {{memberCount}} members!",
  farewellMessage:
    "Goodbye **{{mention}}**, **{{server}}** says farewell!\n\n**{{server}}** now has {{memberCount}} members!",

  channels: {
    member: "",
    audit: "",
    lvlUp: ""
  }
};

export type GuildEntityChannels = Record<
  "member" | "audit" | "lvlUp",
  Snowflake
>;
export interface ReactionMenu {
  roles: Record<Snowflake, string>;
  type: "switch" | "multi";
}

export interface WarnPunishment {
  type: "ban" | "kick" | "mute";
  duration?: number;
}

export type VerifySettings = Verify | VerifyReaction | VerifyMessage;

export interface Verify {
  type: "captcha" | "reaction" | "command" | "message";
  role: Array<string>;
  channel: string;
  onFail: "kick" | "ban";
}

export interface VerifyReaction extends Verify {
  type: "reaction";
  emoji: string;
}

export interface VerifyMessage extends Verify {
  type: "message";
  content: string;
}
