import { Language } from "klasa";
import { Util } from "../../lib/util/Util";

export default class EnglishLanguage extends Language {
  get language() {
    return {
      ...this.DEFAULTS,
      cmds: {
        util: {
          ping: {
            res: (client: number) => `Pong! My ping is *${client}ms*`,
          },
        },
        
        sfw: {
          baka: ""
        }
      },
      music: {
        nope: "What? I dont have a player for this guild...",
        join: {
          alr: "I am already in a voice channel.",
          jvc: "Please join a voice channel.",
          perms: "I need perms to `Speak` and `Connect`",
          summoned: `Okay I joined your voice channel!`,
        },
        pause: {
          desc: "Pause any currently playing music.",
          res: "Okay, I paused the player."
        },
        play: {

        },
        resume: {
          desc: "Resume any currently paused music.",
          res: "Okay, I resumed the player."
        }
      },
    };
  }

  public get DEFAULTS() {
    return {
      DEFAULT: (key: any) => `\`${key}\` has not been localized for en-US yet.`,
      DEFAULT_LANGUAGE: "Default Language",
      PREFIX_REMINDER: (prefix = `@${this.client.user.tag}`) =>
        `The prefix${
          Array.isArray(prefix)
            ? `es for this guild are: ${prefix
                .map((pre) => `\`${pre}\``)
                .join(", ")}`
            : ` in this guild is set to: \`${prefix}\``
        }`,
      SETTING_GATEWAY_EXPECTS_GUILD:
        "The parameter <Guild> expects either a Guild or a Guild Object.",
      SETTING_GATEWAY_VALUE_FOR_KEY_NOEXT: (data: any, key: any) =>
        `The value ${data} for the key ${key} does not exist.`,
      SETTING_GATEWAY_VALUE_FOR_KEY_ALREXT: (data: any, key: any) =>
        `The value ${data} for the key ${key} already exists.`,
      SETTING_GATEWAY_SPECIFY_VALUE:
        "You must specify the value to add or filter.",
      SETTING_GATEWAY_KEY_NOT_ARRAY: (key: any) =>
        `The key ${key} is not an Array.`,
      SETTING_GATEWAY_KEY_NOEXT: (key: any) =>
        `The key ${key} does not exist in the current data schema.`,
      SETTING_GATEWAY_INVALID_TYPE:
        "The type parameter must be either add or remove.",
      SETTING_GATEWAY_INVALID_FILTERED_VALUE: (piece: any, value: any) =>
        `${piece.key} doesn't accept the value: ${value}`,
      RESOLVER_MULTI_TOO_FEW: (name: any, min = 1) =>
        `Provided too few ${name}s. At least ${min} ${
          min === 1 ? "is" : "are"
        } required.`,
      RESOLVER_INVALID_BOOL: (name: any) => `${name} must be true or false.`,
      RESOLVER_INVALID_CHANNEL: (name: any) =>
        `${name} must be a channel tag or valid channel id.`,
      RESOLVER_INVALID_CUSTOM: (name: any, type: any) =>
        `${name} must be a valid ${type}.`,
      RESOLVER_INVALID_DATE: (name: any) => `${name} must be a valid date.`,
      RESOLVER_INVALID_DURATION: (name: any) =>
        `${name} must be a valid duration string.`,
      RESOLVER_INVALID_EMOJI: (name: any) =>
        `${name} must be a custom emoji tag or valid emoji id.`,
      RESOLVER_INVALID_FLOAT: (name: any) => `${name} must be a valid number.`,
      RESOLVER_INVALID_GUILD: (name: any) =>
        `${name} must be a valid guild id.`,
      RESOLVER_INVALID_INT: (name: any) => `${name} must be an integer.`,
      RESOLVER_INVALID_LITERAL: (name: any) =>
        `Your option did not match the only possibility: ${name}`,
      RESOLVER_INVALID_MEMBER: (name: any) =>
        `${name} must be a mention or valid user id.`,
      RESOLVER_INVALID_MESSAGE: (name: any) =>
        `${name} must be a valid message id.`,
      RESOLVER_INVALID_PIECE: (name: any, piece: any) =>
        `${name} must be a valid ${piece} name.`,
      RESOLVER_INVALID_REGEX_MATCH: (name: any, pattern: any) =>
        `${name} must follow this regex pattern \`${pattern}\`.`,
      RESOLVER_INVALID_ROLE: (name: any) =>
        `${name} must be a role mention or role id.`,
      RESOLVER_INVALID_STRING: (name: any) => `${name} must be a valid string.`,
      RESOLVER_INVALID_TIME: (name: any) =>
        `${name} must be a valid duration or date string.`,
      RESOLVER_INVALID_URL: (name: any) => `${name} must be a valid url.`,
      RESOLVER_INVALID_USER: (name: any) =>
        `${name} must be a mention or valid user id.`,
      RESOLVER_STRING_SUFFIX: " characters",
      RESOLVER_MINMAX_EXACTLY: (name: any, min: any, suffix: any) =>
        `${name} must be exactly ${min}${suffix}.`,
      RESOLVER_MINMAX_BOTH: (name: any, min: any, max: any, suffix: any) =>
        `${name} must be between ${min} and ${max}${suffix}.`,
      RESOLVER_MINMAX_MIN: (name: any, min: any, suffix: any) =>
        `${name} must be greater than ${min}${suffix}.`,
      RESOLVER_MINMAX_MAX: (name: any, max: any, suffix: any) =>
        `${name} must be less than ${max}${suffix}.`,
      REACTIONHANDLER_PROMPT: "Which page would you like to jump to?",
      COMMANDMESSAGE_MISSING:
        "Missing one or more required arguments after end of input.",
      COMMANDMESSAGE_MISSING_REQUIRED: (name: any) =>
        `${name} is a required argument.`,
      COMMANDMESSAGE_MISSING_OPTIONALS: (possibles: any) =>
        `Missing a required option: (${possibles})`,
      COMMANDMESSAGE_NOMATCH: (possibles: any) =>
        `Your option didn't match any of the possibilities: (${possibles})`,
      // eslint-disable-next-line max-len
      MONITOR_COMMAND_HANDLER_REPROMPT: (
        tag: any,
        error: any,
        time: any,
        abortOptions: any
      ) =>
        `${tag} | **${error}** | You have **${time}** seconds to respond to this prompt with a valid argument. Type **${abortOptions.join(
          "**, **"
        )}** to abort this prompt.`,
      // eslint-disable-next-line max-len
      MONITOR_COMMAND_HANDLER_REPEATING_REPROMPT: (
        tag: any,
        name: any,
        time: any,
        cancelOptions: any
      ) =>
        `${tag} | **${name}** is a repeating argument | You have **${time}** seconds to respond to this prompt with additional valid arguments. Type **${cancelOptions.join(
          "**, **"
        )}** to cancel this prompt.`,
      MONITOR_COMMAND_HANDLER_ABORTED: "Aborted",
      // eslint-disable-next-line max-len
      INHIBITOR_COOLDOWN: (remaining: any, guildCooldown: any) =>
        `${
          guildCooldown ? "Someone has" : "You have"
        } already used this command. You can use this command again in ${remaining} second${
          remaining === 1 ? "" : "s"
        }.`,
      INHIBITOR_DISABLED_GUILD:
        "This command has been disabled by an admin in this guild.",
      INHIBITOR_DISABLED_GLOBAL:
        "This command has been globally disabled by the bot owner.",
      INHIBITOR_MISSING_BOT_PERMS: (missing: any) =>
        `Insufficient permissions, missing: **${missing}**`,
      INHIBITOR_NSFW: "You can only use NSFW commands in NSFW channels.",
      INHIBITOR_PERMISSIONS: "You do not have permission to use this command.",
      INHIBITOR_REQUIRED_SETTINGS: (settings: any) =>
        `The guild is missing the **${settings.join(", ")}** guild setting${
          settings.length !== 1 ? "s" : ""
        } and thus the command cannot run.`,
      INHIBITOR_RUNIN: (types: any) =>
        `This command is only available in ${types} channels.`,
      INHIBITOR_RUNIN_NONE: (name: any) =>
        `The ${name} command is not configured to run in any channel.`,
      COMMAND_STATS_DESCRIPTION:
        "Provides some details about the bot and stats.",
      MESSAGE_PROMPT_TIMEOUT: "The prompt has timed out.",
      TEXT_PROMPT_ABORT_OPTIONS: ["abort", "stop", "cancel"],
    };
  }
}
