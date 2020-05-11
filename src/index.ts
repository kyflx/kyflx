import { Kyflx, KlasaConfig } from "./lib";
new Kyflx(KlasaConfig).init().login(config.getEnv("bot.token"));
