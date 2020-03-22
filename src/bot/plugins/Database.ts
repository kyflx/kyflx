import Logger from "@ayanaware/logger";
import { createConnection, getRepository } from "typeorm";
import {
  CaseEntity,
  Config,
  GuildEntity,
  GuildProvider,
  Plugin,
  ProfileEntity,
  TagEntity
} from "../../lib";

export default class Database extends Plugin {
  public name = "database";
  public logger: Logger = Logger.get(Database);
  public ready: boolean = false;

  public async onReady() {
    createConnection({
      url: Config.getEnv<string>("uri"),
      entities: [GuildEntity, ProfileEntity, CaseEntity, TagEntity],
      type: "postgres",
      synchronize: true
    }).then(
      async c => {
        this.client._guilds = new GuildProvider(getRepository(GuildEntity));
        await this.client._guilds.init();
        this.logger.info("Connected to the database", `c: ${c.name}`);
        this.ready = true;
      },
      reason => this.logger.error(reason)
    );
  }
}
