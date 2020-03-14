import { Snowflake } from "discord.js";

export * from "./Game";
export * from "./Player";
export * from "./Night";

export interface MafiaDBObject {
	daytime: Snowflake;
	detective: Snowflake;
	doctor: Snowflake;
	mafia: Snowflake;
	detectiveLimit: number;
	doctorLimit: number;
	mafiaLimit: number;
	villagerLimit: number;
	playerRole: Snowflake;
	moderatorRole: Snowflake;
	configured: boolean;
}
