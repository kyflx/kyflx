import { Kyflx, KlasaConfig } from "./lib";

new Kyflx(KlasaConfig).init().login(config.get("bot.token.development"));
