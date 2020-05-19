import { Provider, SettingsUpdateResultEntry, util } from "klasa";
import { MasterPool, r, R } from "rethinkdb-ts";

type Statement =
  | SettingsUpdateResultEntry[]
  | [string, any][]
  | Record<string, any>;

export default class extends Provider {
  public db: R = r;
  public pool: MasterPool;

  async init() {
    this.pool = await r.connectPool({
      db: "kyflx",
      silent: false,
      host: "localhost",
      port: 28015,
    });

    await r
      .branch(r.dbList().contains("kyflx"), null, r.dbCreate("kyflx"))
      .run();
  }

  public shutdown() {
    return this.pool.drain();
  }

  /* Table methods */

  public hasTable(table: string) {
    return this.db.tableList().contains(table).run();
  }

  public createTable(table: string) {
    return this.db.tableCreate(table).run();
  }

  public deleteTable(table: string) {
    return this.db.tableDrop(table).run();
  }

  public sync(table: string) {
    return this.db.table(table).sync().run();
  }

  /* Document methods */

  public async getAll(table: string, entries: any[] = []) {
    if (entries.length) {
      const chunks = util.chunk(entries, 50000);
      const output = [];
      for (const myChunk of chunks)
        output.push(
          ...(await this.db
            .table(table)
            .getAll(...myChunk)
            .run())
        );
      return output;
    }
    return this.db.table(table).run();
  }

  public async getKeys(table: string, entries: any[] = []) {
    if (entries.length) {
      const chunks = util.chunk(entries, 50000);
      const output = [];
      for (const myChunk of chunks)
        output.push(
          ...(await this.db
            .table(table)
            .getAll(...myChunk)("id")
            .run())
        );
      return output;
    }
    return this.db.table(table)("id").run();
  }

  public get(table: string, id: string) {
    return this.db.table(table).get(id).run();
  }

  public has(table: string, id: string) {
    return this.db.table(table).get(id).ne(null).run();
  }

  public getRandom(table: string) {
    return this.db.table(table).sample(1).run();
  }

  public create(table: string, id: string, value: any = {}) {
    return this.db
      .table(table)
      .insert({ ...this.parseUpdateInput(value), id })
      .run();
  }

  public update(table: string, id: string, value: Statement) {
    return this.db
      .table(table)
      .get(id)
      .update(this.parseUpdateInput(value))
      .run();
  }

  public replace(table: string, id: string, value: Statement) {
    return this.db
      .table(table)
      .get(id)
      .replace({ ...this.parseUpdateInput(value), id })
      .run();
  }

  public delete(table: string, id: string) {
    return this.db.table(table).get(id).delete().run();
  }
}
