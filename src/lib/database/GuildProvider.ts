import { Provider } from "discord-akairo";
import { Collection } from "discord.js";
import { GuildEntity } from "./models";

export default class GuildProvider extends Provider {
  public items: Collection<string, GuildEntity> = new Collection();

  public async init() {
    for (const guild of await GuildEntity.find({}))
      this.items.set(guild.guildId, guild);
  }

  public async clear(id: string): Promise<boolean> {
    if (!this.items.has(id)) return false;
    await GuildEntity.delete({ guildId: id });
    return true;
  }

  public create(id: string): GuildEntity {
    return GuildEntity.create({
      guildId: id
    });
  }

  public async delete<K extends keyof GuildEntity>(
    id: string,
    key: K
  ): Promise<GuildEntity> {
    const item = this.items.get(id) || this.create(id);

    delete item[key];
    await GuildEntity.update({ guildId: id }, item);
    this.items.set(id, item);

    return item;
  }

  public get<K extends keyof GuildEntity>(
    id: string,
    key: K,
    defaultValue: GuildEntity[K]
  ): GuildEntity[K] {
    let item = this.items.get(id);
    if (!item) item = this.create(id);
    return item[key] === undefined ? defaultValue : item[key];
  }

  public async set<K extends keyof GuildEntity>(
    id: string,
    key: K,
    value: GuildEntity[K]
  ): Promise<GuildEntity> {
    let item = this.items.get(id);
    if (!item) item = this.create(id);

    item[key] = value;
    await GuildEntity.update({ guildId: id }, item);
    this.items.set(id, item);

    return item;
  }
}
