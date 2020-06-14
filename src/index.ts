import { KlasaConfig, Kyflx } from "./lib";
import { Schema } from "klasa";

const kyflx = new Kyflx(KlasaConfig).init();

kyflx.gateways.register("infractions", {
  provider: "rethinkdb",
  schema: new Schema()
    .add("id", "number")
    .add("moderator", "user")
    .add("subject", "any")
    .add("reason", "string", { default: "None given." })
    .add("type", "string")
    .add("duration", "number"),
});

kyflx.login(config.getEnv("bot.token"));
