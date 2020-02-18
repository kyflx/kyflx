import { VorteClient } from "@vortekore/lib";
import { YouTube } from "better-youtube-api";
import { config } from "dotenv";
import { join } from "path";

config({ path: join(process.cwd(), ".env") });
const bot = new VorteClient(__dirname);

export const developers = bot.developers;
export const api = new YouTube(bot.config.get("YOUTUBE_API_KEY"));

bot.login(bot.config.get("TOKEN"));
