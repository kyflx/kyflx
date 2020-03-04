import { Snowflake } from "discord.js";

export { default as CaseEntity } from "./Case";
export { default as GuildEntity } from "./Guild";
export { default as ProfileEntity } from "./Profile";
export { default as TagEntity } from "./Tag";

export interface CaseEdit {
  date: number;
  moderation: string;
  props: string;
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

export type GuildEntityChannels = Record<"member" | "audit", Snowflake>;
export type ReactionMenu = {
  roles: Record<Snowflake, string>;
  type: "switch" | "multi";
};

export type WarnPunishment = {
  type: "ban" | "kick" | "warn" /* ? */ | "mute";
  duration?: number;
};

export type VerifySettings = Verify | VerifyReaction | VerifyMessage;

export interface Verify {
  type: "captcha" | "reaction" | "command" | "message";
  role: string[];
  channel: string;
  onFail: "kick" | "ban"
}

export interface VerifyReaction extends Verify {
  type: "reaction";
  emoji: string;
}

export interface VerifyMessage extends Verify {
  type: "message";
  content: string;
}
