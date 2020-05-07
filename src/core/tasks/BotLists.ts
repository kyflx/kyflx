import { Task, TaskOptions } from "klasa";
import { Init } from "../../lib";

@Init<TaskOptions>({ name: "bot-lists" })
export default class BotListsTask extends Task {
  public async run() {
    const apis = this.client.apis;
    Promise.all([
      apis.api("dbl").postStats(this.client.guilds.cache.size),
      apis.api("vultrex").postStats(this.client.guilds.cache.size),
    ])
      .then(() => this.client.logger.success("Posted Stats to DBL and Vultrex"))
      .catch((err) => this.client.logger.error(err));
  }

  public async init() {
    if (process.env.NODE_ENV === "development") return this.unload();
    this.client.schedule.create("bot-lists", "*/5 * * * *", { catchUp: true });
    this.client.logger.note("Stats are getting posted every 5 minutes.");
  }
}
