import { KlasaClientOptions } from "klasa";
import { join } from "path";
import { Config } from "@kyflx-dev/util";

export const KlasaConfig: KlasaClientOptions = {
  directory: join(process.cwd(), "build/core"),
  disabledCorePieces: ["commands"],
  prefix: Config.getInstance().get("bot.prefixes"),
  commandEditing: true,
  pieceDefaults: {
    apis: {
      enabled: true,
      url: "",
    },
    commands: {
      cooldown: 5,
    },
  },
};
