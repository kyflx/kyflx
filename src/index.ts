import { YouTube } from "better-youtube-api";
import { WebhookClient } from "discord.js";
import { config } from "dotenv";
import { join } from "path";
import { Counter, register } from "prom-client";
import { Config, Stats, VorteClient } from "./lib";

config({ path: join(process.cwd(), ".env") });
const bot = new VorteClient(join(__dirname, "bot"));

export const logs = new WebhookClient(
  Config.get("wh_logs"),
  Config.get("wh_logs_token")
);
export const api = new YouTube(Config.get("apis.youtube"));
export const stats: Stats = {
  commands: new Counter({
    name: "commands_ran",
    help: "All the commands that have been ran since bot boot"
  }),
  messages: new Counter({
    name: "messages_seen",
    help: "All the messages seen since the bot booted"
  }),
  register
};

(async () => {
  await bot.login(Config.getEnv("token"));
})().catch(error => bot.logger.error(error));
