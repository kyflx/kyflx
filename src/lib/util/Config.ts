import { Config } from "@kyflx-dev/util";
import { KlasaClientOptions, PermissionLevels, Schema } from "klasa";
import { join } from "path";

export const KlasaConfig: KlasaClientOptions = {
  directory: join(process.cwd(), "build/core"),
  disabledCorePieces: [ "commands" ],
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
  providers: {
    default: "rethinkdb",
  },
  customPromptDefaults: { limit: 1, time: 60000, quotedStringSupport: true },
  typing: true,
  createPiecesFolders: false,
  gateways: {
    guilds: {
      schema: new Schema()
        .add("autoRoles", "role", { array: true, default: [] })
        .add("prefix", "string", { array: true, default: [ "ky!" ] })
        .add("disabledCommands", "command", { array: true })
        .add("queueLength", "number", { default: 250 })
        .add("announceNext", "boolean", { default: true })
        .add("cases", "number", { default: 0 })
        .add("inviteFilter", (folder) => folder
          .add("enabled", "boolean", { default: false })
          .add("whitelist", "string", { array: true })
          .add("blacklist", "string", { array: true })
          .add("punishment", "any"))
        .add("swearFilter", (folder) => folder
          .add("enabled", "boolean", { default: false })
          .add("whitelist", "string", { array: true })
          .add("blacklist", "string", { array: true })
          .add("punishment", "any"))
        .add("logs", (folder) => folder
          .add("ban", "boolean", { default: true })
          .add("kick", "boolean", { default: true })
          .add("mute", "boolean", { default: true })
          .add("lockdown", "boolean", { default: true })
          .add("slowmode", "boolean", { default: true })
          .add("roleRemove", "boolean", { default: true })
          .add("roleAdd", "boolean", { default: true })
          .add("purge", "boolean", { default: true }))
        .add("channels", (folder) => folder
          .add("audit", "TextChannel")
          .add("levelUp", "TextChannel")
          .add("members", "TextChannel")
          .add("vc", "VoiceChannel")
          .add("commands", "TextChannel"))
        .add("audit", (folder) => folder
          .add("memberJoin", "boolean", { default: false })
          .add("memberLeave", "boolean", { default: false })
          .add("messageDelete", "boolean", { default: false })
          .add("messageUpdate", "boolean", { default: false })
          .add("channelCreate", "boolean", { default: false })
          .add("channelDelete", "boolean", { default: false })
          .add("channelUpdate", "boolean", { default: false })
          .add("roleCreate", "boolean", { default: false })
          .add("roleDelete", "boolean", { default: false })
          .add("roleUpdate", "boolean", { default: false })
          .add("guildUpdate", "boolean", { default: false })
          .add("memberUpdate", "boolean", { default: false }))
        .add("farewell", "any")
        .add("welcome", "any")
        .add("roles", (folder) => folder
          .add("muted", "Role")
          .add("moderator", "Role")
          .add("admin", "Role"))
        .add("dj", (folder) => folder
          .add("role", "Role")
          .add("locked", "command", { array: true }))
        .add("language", "language", { default: "en-US" })
    },
    users: {
      schema: new Schema()
        .add("color", "number", { default: 0x7289da })
        .add("bio", "string", { default: "An awesome kyflx user." }),
      // .add("premium", "string", { default: "free" })
    },
  },
  // TODO: User premium permission levels.
  // TODO: DJ Role.
  permissionLevels: new PermissionLevels()
    .add(0, () => true)
    .add(2, (m) => m.member.roles.cache.has(m.guildSettings.get("dj.role"))) // DJ
    .add(5, (m) => {
      const moderator = m.guildSettings.get("roles.moderator")
      if (moderator && m.member.roles.cache.has(moderator.id)) return true;
      return m.member.hasPermission("MANAGE_GUILD");
    })
    .add(6, (m) => {
      const admin = m.guildSettings.get("roles.admin")
      if (admin && m.member.roles.cache.has(admin.id)) return true;
      return m.member.hasPermission("ADMINISTRATOR");
    })
    .add(7, (m) => m.guild.ownerID === m.author.id) // Guild Owner
    .add(8, (m) => m.member.roles.cache.has("709646805775941653")) // Support Team Member
    .add(9, ({ author, client }) => client.owners.has(author), { break: true })
    .add(10, ({ author, client }) => client.owners.has(author)),
};
