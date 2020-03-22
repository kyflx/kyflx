import { AkairoHandler } from "discord-akairo";
import { Collection } from "discord.js";
import { get } from "dot-prop";
import { existsSync } from "fs";
import { join } from "path";
import VorteClient from "../Client";
import Language from "./Language";

export default class LanguageProvider {
  public languages: Collection<string, Language> = new Collection();

  /**
   * Loads all the language files in the i18n folder
   * @param client - The discord client.
   */
  public init(client: VorteClient): void {
    if (existsSync(join(client.directory, "i18n"))) {
      for (const f of AkairoHandler.readdirRecursive(
        join(client.directory, "i18n")
      )) {
        // tslint:disable-next-line: tsr-detect-non-literal-require
        const language: Language = new ((_ => _.default)(require(f)))();
        language._init(this, client);
        this.languages.set(language.id, language);
      }
    }
  }

  /**
   * Gets a translation from the desired language.
   * @param  id - Language ID
   * @param path The translation key to fetch.
   * @param i An object used for interpolation.
   * @returns The desired translation.
   */
  public get<T extends any>(
    id: string,
    path: string,
    i: Record<string, any> = {}
  ): T {
    const language = this.languages.get(id);
    if (!language) return null;

    let result = this._getResult(path, language);
    if (!result) return null;
    if (typeof result === "function")
      result = result.apply(language, Object.values(i));

    Object.keys(i).forEach(k => (result = result.replace(`{{${k}}}`, i[k])));

    return result;
  }

  /**
   * Gets the translation from a given path.
   * @param path - The translation path.
   * @param language - The desired translation language
   * @returns - The translation
   */
  private _getResult(path: string, language: Language): any {
    let data: Record<"group" | "path", string>;
    if (/[a-z0-9]+:[a-z._0-9]+/i.test(path))
      data = {
        group: path.split(":")[0],
        path: path.split(":")[1]
      };
    else data = { group: null, path };

    return get(
      data.group ? language.data[data.group] : language.data,
      data.path
    );
  }
}
