import LanguageProvider from "./Provider";
import VorteClient from "../Client";

export interface LanguageOptions {
  displayName: string;
  aliases?: string[];
  authors?: string[];
}

/**
 * A class used for storing translations. Used with the {@see LanguageProvider}.
 * @since i18n Update
 */
export default abstract class Language {
  public client: VorteClient;
  public provider: LanguageProvider;

  public displayName: string;
  public aliases: string[];
  public authors: string[];

  /**
   * Initalizes this Class.
   * @param {string} id - The language ID, used for identifying it.
   * @param {LanguageOptions} options - Display Name, aliases, and authors.
   */
  protected constructor(public id: string, options: LanguageOptions) {
    this.displayName = options.displayName;
    this.aliases = options.aliases || [];
    this.authors = options.authors || [];
  }

  /**
   * Used for defining language translations.
   * @abstract
   */
  public abstract get data(): Record<string, any>;

  _init(provider: LanguageProvider, client: VorteClient) {
    this.client = client;
    this.provider = provider;
  }
}
