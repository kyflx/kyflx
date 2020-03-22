import { get } from "dot-prop";
import { readFileSync } from "fs";
import { join } from "path";

const CONFIG_DATA = Symbol("ParsedConfigData");
export default class Config {
  private static [CONFIG_DATA] = JSON.parse(
    readFileSync(join(process.cwd(), "config.json")).toString()
  );

  /**
   * Get a value from the environment settings.
   * @template T - The "key" used for a typed return value.
   * @param key - The key used for indexing.
   * @returns The value stored in that keyed position.
   */
  public static getEnv<T>(key: string): T {
    return get(Config[CONFIG_DATA][process.env.NODE_ENV.toLowerCase()], key);
  }

  /**
   * Get a value from the settings.
   * @template T - The "key" used for a typed return value.
   * @param key - The key used for indexing.
   * @returns The value stored in that keyed position.
   */
  public static get<T>(key: string): T {
    return get(Config[CONFIG_DATA], key);
  }
}
