import KyflxClient from "../Client";
import LanguageProvider from "./Provider";

export interface LanguageOptions {
  displayName: string;
  aliases?: Array<string>;
  authors?: Array<string>;
}

/**
 * A class used for storing translations. Used with the {@see LanguageProvider}.
 * @since i18n Update
 */
export default abstract class Language {
  public client: KyflxClient;
  public provider: LanguageProvider;

  public displayName: string;
  public aliases: Array<string>;
  public authors: Array<string>;

  /**
   * Initalizes this Class.
   * @param id - The language ID, used for identifying it.
   * @param options - Display Name, aliases, and authors.
   */
  protected constructor(public id: string, options: LanguageOptions) {
    this.displayName = options.displayName;
    this.aliases = options.aliases || [];
    this.authors = options.authors || [];
  }

  /**
   * Used for defining language translations.
   */
  public abstract get data(): Record<string, any>;

  public _init(provider: LanguageProvider, client: KyflxClient) {
    this.client = client;
    this.provider = provider;
  }
}
