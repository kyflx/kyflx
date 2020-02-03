import { VorteClient } from "@vortekore/lib";
import { YouTube } from "better-youtube-api";
import { config } from "dotenv";
import { join } from "path";

config({ path: join(process.cwd(), ".env") });
export const developers = ["464499620093886486", "396096412116320258"];
export const api = new YouTube(process.env.YOUTUBE_API_KEY);

const bot = new VorteClient(__dirname);

bot.events.loadAll();
bot.commands.loadAll();

bot.login(bot.config.get("TOKEN"));
