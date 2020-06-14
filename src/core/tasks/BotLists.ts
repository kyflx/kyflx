import { Task, TaskOptions } from "klasa";
import { Init } from "../../lib";

@Init<TaskOptions>({ name: "bot-lists" })
export default class BotListsTask extends Task {
  public async run() {
    const apis = this.client.apis;

    Promise.all([
      apis.api("dbl").postStats(this.client.guilds.cache.size),
    ])
      .then(() => this.client.logger.success("Posted Stats to DBL."))
      .catch((err) => this.client.logger.error(err));
  }

  public async init() {
    if (process.env.NODE_ENV === "development") return this.unload();
  }
}
