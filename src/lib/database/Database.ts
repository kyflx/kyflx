import Logger from "@ayanaware/logger";
import { createConnection } from "typeorm";
import Plugin from "../classes/Plugin";
import GuildProvider from "./GuildProvider";
import { CaseEntity, GuildEntity, ProfileEntity } from "./models";
import TagEntity from "./models/Tag";

export default class Database extends Plugin {
  public name = "database";
  public logger: Logger = Logger.get(Database);
  public ready: boolean = false;

  public guilds: GuildProvider = new GuildProvider();

  public async onReady() {
    createConnection({
      url: this.client.config.get("URI")!,
      entities: [GuildEntity, ProfileEntity, CaseEntity, TagEntity],
      type: "mongodb",
      extra: {
        useUnifiedTopology: true
      }
    }).then(
      async c => {
        this.logger.info("Connected to MongoDB", `c: ${c.name}`);
        await this.guilds.init();
        this.ready = true;
      },
      reason => this.logger.error(reason, `Database`)
    );
  }
}
