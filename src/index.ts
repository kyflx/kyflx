import { YouTube } from "better-youtube-api";
import { config } from "dotenv";
import { join } from "path";
import { Counter, register } from "prom-client";
import { Stats, VorteClient } from "./lib";

config({ path: join(process.cwd(), ".env") });
const bot = new VorteClient(join(__dirname, "bot"));

export const api = new YouTube(bot.config.get("YOUTUBE_API_KEY"));
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

bot.login(bot.config.get("TOKEN"));
