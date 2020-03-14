import { Collection, Snowflake } from "discord.js";
import VorteClient from "../Client";
import { MafiaGame } from "../games/mafia";

export interface GuildGames {
  mafia?: MafiaGame;
}

export default class GameManager {
  public games: Collection<Snowflake, GuildGames> = new Collection();
  public constructor(public client: VorteClient) {}

  public set(
    guild: Snowflake,
    obj: GuildGames
  ): Collection<Snowflake, GuildGames> {
    return this.games.set(guild, obj);
  }

  public get(guild: Snowflake): GuildGames {
    return this.games.get(guild);
  }

  public setGame<K extends keyof GuildGames>(
    guild: Snowflake,
    name: K,
    game: GuildGames[K]
  ): Collection<Snowflake, GuildGames> {
    let games = this.games.get(guild) || {};
    games[name] = game;
    return this.set(guild, games);
  }

  public getGame<K extends keyof GuildGames>(
    guild: Snowflake,
    name: K
  ): GuildGames[K] {
    const games = this.games.get(guild);
    if (!games) return null;
    return games[name];
  }

  public deleteGame(guild: Snowflake, name: keyof GuildGames): boolean {
    const games = this.games.get(guild);
    if (!games) return false;

    delete games[name];
    this.games.set(guild, games);

    return true;
  }
}
