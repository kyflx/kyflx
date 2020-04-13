import Logger from "@ayanaware/logger";
import { TrackInfo } from "@lavalink/encoding";
import { Shoukaku, ShoukakuPlayer } from "shoukaku";
import { UpdateResult } from "typeorm";
import Database from "../bot/plugins/Database";
import { Plugin, Queue } from "./classes";
import "./classes/Discord";
import KyflxClient from "./Client";
import { GuildProvider, GuildSettings, ProfileEntity } from "./database";
import { GameManager } from "./games";
import { BassLevels } from "./typings";
import "./util/Logging";


export * from "./classes";
export { default as KyflxClient } from "./Client";
export * from "./database";
export * from "./games";
export * from "./i18n";
export * from "./typings";
export * from "./util";

declare global {
  interface String {
    capitalize(): string;
    ignoreCase(value: string): boolean;
    trunc(n: number, useWordBoundary?: boolean): String;
  }

  interface ObjectConstructor {
    keys<T extends object>(o: T): Array<keyof T>;
  }

  function when<
    O extends Record<string, () => any>,
    K extends Exclude<keyof O, "else">
  >(query: K, obj: O): any;
}

declare module "discord.js" {
  interface Message {
    client: KyflxClient;
    _guild: GuildSettings;
    profile: ProfileEntity;
    player: ShoukakuPlayer;
    queue: Queue;

    update(key: string, value: any): Promise<UpdateResult>;
    sem(
      content: string,
      options?: { type?: "normal" | "error"; t?: boolean; _new?: boolean },
      i?: Record<string, any>
    ): Promise<Message>;

    t<T extends any>(key: string, i?: Record<string, any>): T;
  }
}

declare module "discord-akairo" {
  interface AkairoClient {
    plugins: Map<string, Plugin>;
    games: GameManager;
    commands: CommandHandler;
    events: ListenerHandler;
    music: Shoukaku;

    logger: Logger;
    database: Database;
    _guilds: GuildProvider;

    maintenance: boolean;
    developers: Array<string>;
    directory: string;

    decode(track: string): TrackInfo;
    ensureGuild(guildId: string): GuildSettings;
    ensureProfile(userId: string, guildId: string): Promise<ProfileEntity>;
  }
}

declare module "shoukaku" {
  interface ShoukakuPlayer {
    bass: BassLevels;
    queue: Queue;
    volume: number;
  }
}
