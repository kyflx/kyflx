import { config } from 'dotenv';
import { VorteClient, Config } from "@vortekore/lib";

config()

const bot = new VorteClient({ directory: __dirname });

bot.handler.loadCommands();
bot.handler.loadEvents();

bot.login(Config.get("token"));
