import { config } from 'dotenv';
import { VorteClient, Config } from "@vortekore/lib";
import { join } from "path";

config({ path: join(process.cwd(), ".env") });

const bot = new VorteClient(__dirname);

bot.events.loadAll();
bot.commands.loadAll();

bot.login(Config.get("token"));

