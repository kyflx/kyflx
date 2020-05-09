import { KlasaClientOptions } from "klasa";
import { join } from "path";
import { Config } from "@kyflx-dev/util";
import { PermissionLevels } from "klasa";

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
  // TODO: User premium permission levels.
  permissionLevels: new PermissionLevels()
    .add(0, () => true)
    .add(6, (message) => message.member.hasPermission("MANAGE_GUILD"))
    .add(7, (message) => message.guild.ownerID === message.author.id)
    .add(9, ({ author, client }) => client.owners.has(author), { break: true })
    .add(10, ({ author, client }) => client.owners.has(author)),
};
