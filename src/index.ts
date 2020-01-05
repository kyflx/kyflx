import { VorteClient } from "@vortekore/lib";
import { config } from 'dotenv';
import { join } from "path";
import Logger from "@ayana/logger";

config({ path: join(process.cwd(), ".env") });

export const VERTA_DEPENDENT = false;
const bot = new VorteClient(__dirname);

bot.events.loadAll();
bot.commands.loadAll();

bot.login(bot.config.get("TOKEN"));
process.on("unhandledRejection", (r, p) => Logger.get("process").error(r.toString()));