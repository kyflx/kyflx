import { readFileSync } from "fs";
import { join } from "path";

const CONFIG_DATA = Symbol("ParsedConfigData");

export interface ConfigData {
  NODE_HOST: string;
  NODE_AUTH: string;
  USER_ID: string;
  TOKEN: string;
  URI: string;
  DEFAULT_PREFIX: string | string[];
  REDIS_HOST: string;
  MAINTENANCE: boolean;
  YOUTUBE_API_KEY: string;
  DBL_TOKEN: string;
  EXCLUDED_COMMANDS: string[]
  "BOTLIST.SPACE-TOKEN": string;
}

export type IConfig<T = ConfigData> = Record<
  string | "production" | "development",
  T
>;

export default class Config<D extends ConfigData> {
  private [CONFIG_DATA]: D = JSON.parse(
    readFileSync(join(process.cwd(), "config.json")).toString()
  );
  /**
   * Get a value from the environment settings.
   * @template K - The "key" used for a typed return value.
   * @param {string} key - The key used for indexing.
   * @returns {ConfigData[K]} The value stored in that keyed position.
   */
  public get<K extends keyof D>(key: K): D[K] {
    // @ts-ignore
    return this[CONFIG_DATA][process.env.NODE_ENV][key];
  }
}
