import { Snowflake } from "discord.js";

export * from "./mafia";
export { default as GameManager, GuildGames } from "./Manager";

export interface TabooGame {
  host: Snowflake;
  word: string;
}
