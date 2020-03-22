import { Provider } from "discord-akairo";
import { Guild } from "discord.js";
import * as _ from "dot-prop";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { guildDefaults, GuildEntity, GuildSettings } from "./models";

export default class SettingsProvider extends Provider {
  public constructor(public repo: Repository<GuildEntity>) {
    super();
  }

  public async init(): Promise<void> {
    const settings = await this.repo.find();
    for (const setting of settings)
      this.items.set(setting.guildId, setting.settings);
  }

  public get<T>(guild: string | Guild, key: string, defaultValue: any): T {
    const id = SettingsProvider.getGuildId(guild);
    if (this.items.has(id)) {
      const value = _.get(this.items.get(id), key);
      return value ?? defaultValue;
    }

    return defaultValue as T;
  }

  public create(guild: string | Guild): GuildEntity {
    const guildId = SettingsProvider.getGuildId(guild);
    const item = GuildEntity.create({
      guildId,
      settings: guildDefaults as any
    });
    this.items.set(guildId, item.settings);
    return item.settings;
  }

  public getRaw(guild: string | Guild): GuildSettings {
    const guildId = SettingsProvider.getGuildId(guild);
    return this.items.get(guildId) || this.create(guild);
  }

  public async set(
    guild: string | Guild,
    key: string,
    value: any
  ): Promise<UpdateResult> {
    const guildId = SettingsProvider.getGuildId(guild);
    const data = this.items.get(guildId) || this.create(guild);

    _.set(data, key, value);
    this.items.set(guildId, data);

    return this.repo
      .createQueryBuilder()
      .insert()
      .into(GuildEntity)
      .values({ guildId, settings: data })
      .onConflict('("guildId") DO UPDATE SET "settings" = :settings')
      .setParameter("settings", data)
      .execute();
  }

  public async delete(guild: string | Guild, key: string) {
    const guildId = SettingsProvider.getGuildId(guild);
    const data = this.items.get(guildId) || {};

    _.delete(data, key);
    this.items.set(guildId, data);

    return this.repo
      .createQueryBuilder()
      .insert()
      .into(GuildEntity)
      .values({ guildId, settings: data })
      .onConflict('("guildId") DO UPDATE SET "settings" = :settings')
      .setParameter("settings", data)
      .execute();
  }

  public async clear(guild: string | Guild): Promise<DeleteResult> {
    const guildId = SettingsProvider.getGuildId(guild);
    this.items.delete(guildId);
    return this.repo.delete(guildId);
  }

  public static getGuildId(guild: string | Guild): string {
    if (guild instanceof Guild) return guild.id;
    if (guild === "global" || guild === null) return "0";
    if (typeof guild === "string" && /^\d+$/.test(guild)) return guild;

    throw new TypeError(
      'Guild instance is undefined. Valid instances: guildID, "global" or null.'
    );
  }
}
