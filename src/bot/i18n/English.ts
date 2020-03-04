import {
  Collection,
  GuildMember,
  Message,
  Role,
  TextChannel
} from "discord.js";
import ms from "ms";
import { Language, logs, GuildEntity, WarnPunishment, PUNS } from "../../lib";

export default class English extends Language {
  public constructor() {
    super("en_US", {
      authors: ["MeLike2D"],
      displayName: "English",
      aliases: ["en", "english", "ingles"]
    });
  }

  public get data(): Record<string, any> {
    return {
      def: {
        prompt_cancel: 'Send "cancel" to cancel the command.',
        prompt_timeout: "Oh no... the command has timed out.",
        prompt_ended: "The command has ended.",
        prompt_cancelled: "Okay! I cancelled the command.",
        prompt_retry: "Do you wanna retry that?"
      },
      evts: {
        cmds: {
          cooldown: (remaining: number) =>
            `Sorry, you have **${ms(remaining, {
              long: true
            })}** left on your cooldown :(`,
          guild: "Sorry, this command can only be used in guilds.",
          owner: "Oop I can't allow you to run this command..."
        },
        lvl_up: `Congrats 🎉 You're now level **{{level}}**!`
      },
      cmds: {
        dev: {
          eval: {
            desc: {
              content: "Nothing lol",
              examples: ["v!eval <code>"],
              usage: "v!eval <code>"
            }
          },
          exec: {
            desc: {
              content: "Executes code",
              examples: ["v!exec ls"],
              usage: "v!exec <command>"
            }
          }
        },
        eco: {
          gb: {
            desc: {
              content: "",
              usage: "<amount>",
              examples: ["v!gamble 200"]
            },
            prompt: "From 1-1000 how much do you want to gamble?",
            insuf: "You don't have enough coins for that!",
            am: "The number must be between 0-1000!",
            win: "You've won **{{coins}}** coins!",
            lose: "You've lost **{{coins}}** coins :("
          },
          bk: {
            desc: {
              content: "Withdraws or Deposits money",
              usage: "<locale> [amount]",
              examples: ["v!bank withdraw 200"]
            },
            prompt: "How much do you want to {{locale}}?",
            limit: "The limit for your account is **{{max}}**",
            emdesc: [
              "Withdraw or Deposit money into your Bank!",
              "**Deposit**: Deposit money to the Bank, example: `v!bank deposit 200`",
              "**Withdraw**: Withdraw money from the Bank, example: `v!bank withdraw 200`"
            ].join("\n"),
            dep: "",
            with: "Withdraw money from the Bank, example: v!bank withdraw 200",
            suc: "Successfully {{locale}} **{{amount}}** coins!",
            insuf: "Insufficient coins!"
          },
          lb: {
            desc: {
              content: "Sends the member leaderboard for a guild.",
              usage: "[page #]",
              examples: ["v!lb", "v!lb 2"]
            },
            emp: "Nothing to show 🤷‍♂️."
          },
          prf: {
            desc: {
              content: "Displays your profile in an embed.",
              usage: "[action] <value>",
              examples: ["v!profile set bio I'm cool!"]
            },
            new_bio: "Successfully updated your bio.",
            settings: "The only setting avaliable is **bio**"
          }
        },
        fun: {
          "8b": {
            desc: {
              content: "The magic 8ball will answer you question.",
              usage: "<question>",
              examples: ["v!8ball does my crush like me?"]
            },
            pmt: "Sooo... There is no question?",
            answers: [
              "You may rely on it.",
              "Yes – definitely.",
              "Yes.",
              "Without a doubt.",
              "Very doubtful.",
              "Signs point to yes.",
              "Reply hazy, try again.",
              "Outlook good.",
              "Outlook not so good.",
              "My sources say no.",
              "My reply is no.",
              "Most likely.",
              "It is decidedly so.",
              "It is certain.",
              "Don’t count on it.",
              "Concentrate and ask again.",
              "Cannot predict now.",
              "Better not tell you now.",
              "Ask again later.",
              "As I see it, yes."
            ]
          },
          lmg: {
            desc: {
              content: "Sends a lmgtfy url.",
              usage: "<query>",
              examples: ["v!lmgtfy how to become a human?"]
            },
            prompt: "Are you gonna provide something?"
          },
          rps: {
            desc: {
              content: "Play rock paper scisssors with VorteKore",
              examples: ["v!rps rock", "v!rps scissors"],
              usage: "<rock|paper|scissors>"
            },
            prompt:
              "Sooo... Playing Rock Paper Scissors against Air doesn't work?",
            tie: "I picked **{{bot}}**, It's a tie!",
            win: "I picked **{{bot}}**, you lost! muhahah",
            lost: "I picked **{{bot}}**... you won... 😭"
          },
          uwu: {
            desc: {
              content: "Uwuify's your message",
              usage: "<message>",
              examples: ["v!uwu x3 nuzzles pounces on you uwu u so warm!"]
            },
            prompt: "Provide some text I can uwuify."
          }
        },
        img: {
          cat: {
            desc: {
              content: "Provides a cat picture from r/cats"
            }
          },
          dog: {
            desc: {
              content: "Provides a dog picture from imgur"
            }
          },
          duck: {
            desc: {
              content: "Provides a duck picture from r/duck"
            }
          },
          fox: {
            desc: {
              content: "Provides a fox picture from r/foxes"
            }
          },
          lizard: {
            desc: {
              content: "Provides a lizard picture from r/lizards"
            }
          },
          meme: {
            desc: {
              content: "Provides a meme picture from r/dankmemes"
            }
          },
          owl: {
            desc: {
              content: "Provides an owl picture frmo imgur!"
            },
            ohno: "Oh no, I couldn't find an image."
          },
          panda: {
            desc: {
              content: "Provides a panda picture from imgur"
            }
          },
          pengu: {
            desc: {
              content: "Provides a random penguin picture from r/penguin"
            }
          },
          wolf: {
            desc: {
              content: "Provides a picture of a wolf from r/wolves"
            }
          }
        },
        mod: {
          error: (m: GuildMember) =>
            `Oh no, I couldn't {{action}} **${m.user.tag}**... contact the developers.`,
          memb: "Please provide a member to {{action}}.",
          purp: "Please provide a reason for this {{action}}.",
          hier: (mh: Role, uh: Role) =>
            `That person is ${
              mh.position === uh.position
                ? "in the same level as you"
                : "above you"
            } in the role hierarchy.`,
          confirm: (m: GuildMember) =>
            `I need confirmation to {{action}} **${m.user.tag}** \`(${m.id})\` for reason **"{{reason}}"**`,
          canc: "Okay, I cancelled the command.",
          done: (m: GuildMember) =>
            `{{action}} **${m.user.tag}** \`(${m.id})\` for reason \`{{reason}}\``,
          ban: {
            desc: {
              content: "Bans a member from the server",
              examples: ["v!ban @2D not cool"],
              usage: "<@member> <reason>"
            },
            ursf:
              "If you wanted to ban yourself just leave and never come back..."
          },
          kick: {
            desc: {
              content: "Kicks a member from the server",
              examples: ["v!kick @2D not cool"],
              usage: "<@member> <reason>"
            },
            ursf: "If you wanted to kick yourself just leave..."
          },
          mute: {
            desc: {
              content: "Mutes a member.",
              usage: "<member> <duration> <reason>",
              examples: ["v!mute 2D 10m bad kid"]
            },
            create_mtr: `Okay, use \`@${this.client.user.tag} muterole\` to set a mute role!`,
            mtr_confirm: "Could I create a mute role?",
            ursf: "If you wanted to mute yourself just don't talk...",
            purp: "Please provide a duration for this mute."
          },
          pin: {
            desc: {
              content: "Pins a message of your choice.",
              usage: "<message id>",
              examples: ["v!pin 535585397435006987"]
            },
            alr: "That message is already pinned.",
            "can't": "Sorry, I'm not able to pin that message.",
            prompt: "Please provide a message to {{action}}"
          },
          purge: {
            desc: {
              content: "Purge a number of messages",
              examples: ["v!purge 20 @2D"],
              usage: "<amount> [member]"
            },
            purp: "Please provide an amount of messages you want me to purge.",
            confirm: (
              message: Message,
              messages: Collection<string, Message>,
              reason: string
            ) =>
              `I need confirmation to purge **${messages.size.toLocaleString()}** messages in channel ${
                message.channel
              } \`(${message.channel.id})\` with reason \`${reason}\``,
            done: (message: Message) =>
              `Deleted **{{deleted}}** messages in channel ${message.channel} \`(${message.channel.id})\` with reason **{{reason}}**`,
            error:
              "Sorry, I couldn't purge any messages... contact the developers to see what happened"
          },
          tb: {
            desc: {
              content: "Temporarily bans a member from the server.",
              usage: "<member> <duration> [reason]",
              examples: ["v!ban @2D 2d advertising", "v!ban @2D 1m"]
            },
            ursf:
              "Come on, if you wanted to temp ban yourself just leave for awhile.",
            dur:
              "Please provide a duration for this temp ban.\n**Examples**: '10m', '2d'"
          },
          tm: {
            desc: {
              content: "Temporarily mutes a member for a given duration.",
              usage: "<member> <duration> [reason]",
              examples: ["v!tempmute @2D 10m"]
            },
            ursf:
              "If you wanted to temp mute yourself, just shut up for a few minutes."
          },
          um: {
            desc: {
              content: "Unmutes a muted user.",
              usage: "<member> [reason]",
              examples: ["v!unmute @2D cus he apologized"]
            },
            ursf:
              "Why are you trying to unmute yourself?! There's no way to do it in the first place.",
            not: (m: GuildMember) => `${m} (\`${m.id}\`) isn't muted.`
          },
          unpin: {
            desc: {
              content: "Unpins a message of your choice",
              usage: "<message id>",
              examples: ["v!unpin 535585397435006987"]
            }
          },
          warn: {
            desc: {
              content: "Warns a member",
              usage: "<@member> <reason>",
              examples: ["v!warn @2D#5773 not following rules"]
            },
            ursf: "C'mon man you can't warn yourself..."
          }
        },
        music: {
          no_vc: "Sorry, I'm not in a voice channel...",
          join:
            "Sorry, you're going to have to join the voice channel I am in.",
          join_vc: "Can you please join a voice channel?",
          rad: "Sorry, the player is currently in radio mode :p",
          bb: {
            desc: {
              content: "Manages the bassboost for the guild.",
              examples: ["!bassboost medium"],
              usage: "<high|medium|low|none>"
            },
            lvls:
              "The available levels are **high**, **medium**, **low**, and **none**.",
            curr: "The current bass level for this player is **{{current}}**.",
            res: "Okay! I set the bass level to **{{level}}**!"
          },
          leave: {
            desc: {
              content: "Leaves the voice channel that the bot is currently in."
            },
            res: "Okay, I successfully left the voice channel!"
          },
          np: {
            desc: {
              content: "Displays what is currently playing."
            },
            empty: "Sorry, there is currently nothing playing."
          },
          pause: {
            desc: { content: "Pauses the player if not already resumed." },
            alr: "Oof... the player is already paused :/",
            res: "Okay! I successfully paused the player."
          },
          play: {
            desc: {
              content: "Plays a song in your voide channel.",
              usage: "<query>",
              examples: "v!play city of angels"
            },
            join: "I don't have the permissions to join this channel.",
            speak: "I don't have the permissions to talk in this channel.",
            cancel: "\n\n**Send 'cancel' to cancel the selection.**",
            cancelled: "Okay... I cancelled the song selection.",
            look: "Sorry, I couldn't find what you were looking for :/",
            quota:
              "Oh no... the youtube quota was exceeded, the only way to play songs is to use URLs :("
          },
          queue: {
            desc: {
              content: "Shows the current and next up songs."
            },
            empty: (message: Message) =>
              `hmm... pretty empty, you should add some more songs with **${message.util.parsed.prefix}play**`,
            page: '\n"Use queue <page> to view a specific page."'
          },
          radio: {},
          rm: {
            desc: {
              content: "Removes a song from the queue.",
              usage: "<index>"
            },
            prompt: "Provide the index of the song you want to remove.",
            nope: "Ohh no's... That song isn't in the queue?!",
            res: (decoded: {
              identifier: string;
              isSeekable: boolean;
              author: string;
              length: number;
              isStream: boolean;
              position: number;
              title: string;
              uri: string;
            }) =>
              `Successfully removed [${decoded.title}](${decoded.uri}) from the queue.`
          },
          loop: {
            desc: {
              content: "Repeats the queue or song.",
              examples: ["!repeat queue", "!repeat song"],
              usage: "<song|queue>"
            },
            res: (val: boolean) =>
              `${val ? "Enabled" : "Disabled"} {{type}} repeat for the player.`
          },
          res: {
            desc: {
              content: "Resumes the player if not already paused."
            },
            alr: "Ummmm... the player isn't paused...",
            res: "Okay! I just resumed the player for you :)"
          },
          seek: {
            desc: {
              examples: ["!seek 5s"],
              description: "Seeks to a position in the song",
              usage: "<time>"
            },
            prompt:
              "Please provide a time to skip in (provide it in seconds or minutes, Example: !seek 5s)",
            res: "Okay, I seeked to the requested time."
          },
          shuf: {
            desc: {
              content: "Shuffles the queue."
            },
            res: "Okay, I successfully shuffled the queue"
          },
          skip: {
            desc: {
              content: "Skips the amount of songs you specify (defaults to 1)",
              usage: "<num>",
              examples: ["3", "1"]
            },
            res: "Okay I skipped the last playing song."
          },
          vol: {
            desc: {
              content: "Adjusts the volume of the player.",
              usage: "<volume>",
              examples: ["v!vol 50"]
            },
            res: "Okay! I set the volume to **{{volume}}**!",
            prompt: "Provide a valid number between **1**-**100**.",
            cur: (_: Message) =>
              `The current volume for this guilds player is **${_.player
                .volume || 100}**`
          }
        },
        conf: {
          auto: {
            desc: {
              content: [
                "Manages auto role for new members.",
                "**• add**: Add new roles to the auto role list.",
                "**• remove**: Remove roles from the auto role list.",
                "**• clear/reset**: Clears the list of auto roles."
              ].join("\n"),
              usage: "[set|remove|clear] <[...roles]>",
              examples: [
                "v!autorole",
                "v!autorole add @Members @Newbies",
                "v!autorole remove @Newbies",
                "v!autorole clear"
              ]
            },
            prompt: "Please provide some valid roles.",
            curr: (message: Message) =>
              message._guild.autoRoles.length > 0
                ? `The current auto roles are ${message._guild.autoRoles
                    .map(role => `<@&${role}>`)
                    .join(", ")}`
                : `There are currently no auto roles setup.`,
            cleared: `Okay, I successfully cleared the auto roles.`,
            nothing: "Sorry chief, there's nothing to {{action}}.",
            already:
              "These roles are already being used, if you want to remove them do `ar rm <role>`",
            set: (roles: Role[]) =>
              `Okay, I created some new auto roles: ${roles.join(", ")}`,
            deleted: (roles: Role[]) =>
              `Okay, I removed some of the auto roles: ${roles.join(", ")}`,
            perms: (roles: Role[]) =>
              `The following roles cannot be used: ${roles.join(", ")}`
          },
          dj: {
            desc: {
              content: [
                "Manages the role used for controlling the music player.",
                "**• clear**: Clears the dj role.",
                "**• set**: Changes the dj role."
              ].join("\n"),
              usage: "[clear|set] <[@role|role name|role id]>",
              examples: ["v!dj", "v!dj clear", "v!dj set @Muted"]
            },
            prompt: "Please provide a role I can use for DJs :/",
            cur: (message: Message) =>
              `The current DJ role is ${
                message._guild.djRole
                  ? `<@&${message._guild.djRole}> \`(${message._guild.djRole})\``
                  : "is literally nothing..."
              }`,
            clr:
              "Okay, I cleared the DJ role! To set a new one do `djrole set <role>`!",
            done: (role: Role) =>
              `Okay, I set the DJ role to ${role} \`(${role.id})\``
          },
          emb_c: {},
          lang: {
            desc: {
              content: "Manages this guilds language setting.",
              usage: "[language]",
              examples: ["v!lang ingles", "v!lang english"]
            },
            confirm: (lang: Language) =>
              `Are you sure you want to change the language to ${lang.displayName} \`(${lang.id})\`?`,
            cancelled: "Okay, I cancelled the request to change the language.",
            res: (lang: Language) =>
              `Okay, I changed the language to ${lang.displayName} \`(${lang.id})\`.`
          },
          logs: {
            desc: {
              content: [
                "Manages the logging for this guild.",
                "**• enable/disable**: Enable/Disable specific log events.",
                "**• set**: Changes the channel where logs are sent."
              ].join("\n"),
              usage: "<action> <[channel|...logEvents]>",
              examples: [
                "v!logs enable ban, warn, mute",
                "v!logs disable purge",
                "v!logs enable purge",
                "v!logs set #logs"
              ]
            },
            set_prompt: "Provide a text channel to use as logs.",
            prompt: `Provide some valid log types...\n${logs
              .map(l => `\`${l}\``)
              .join(", ")}`,
            curr: (message: Message, channelKeys: string[]) =>
              `Logs are sent to ${
                message._guild.channels.audit
                  ? `<#${message._guild.channels.audit}> \`(${message._guild.channels.audit})\`.`
                  : `the void...`
              }\n **Enabled Events**: ${Object.keys(message._guild.logs)
                // @ts-ignore
                .filter(k => !channelKeys.includes(k) && message._guild.logs[k])
                .map(key => `\`${key}\``)
                .join(", ") || "Wow nothing"}`,
            chief: "Sorry, can't do anything about that chief...",
            de: (filtered: string[], action: string, all: boolean) =>
              `Okay, I **${action}d** ${
                all
                  ? `all of the events.`
                  : `the ${filtered
                      .map(e => `**${e.trim()}**`)
                      .join(", ")} log events.`
              }`,

            set: (message: Message) =>
              `Okay, I set the logs channel to {{value}} \`(${message._guild.channels.audit})\``,
            reset: "Okay! I successfully reset the log settings."
          },
          lum: {
            desc: {
              content: [
                "Allows you to customize the level up message.",
                "**• redirect**: Redirects level up messages to another channel",
                "**• enable/disable**: Disable/Enable the level up messages.",
                "**• reset**: Resets back to no redirect channel."
              ].join("\n"),
              usage: "[redirect|enable|disable] <[channel]>",
              examples: [
                "v!lum redirect #levelup",
                "v!lum enable",
                "v!lum disable",
                "v!lum reset"
              ]
            },
            prompt:
              "Please provide a channel I can redirect level up messages to.",
            curr: (message: Message) =>
              !message._guild.lvlUpMsg
                ? `Level up messages are currently disabled, do \`lum enable\` to enable them`
                : `Level up messages are enabled${
                    message._guild.lvlUpChannel
                      ? ` and are directed to <#${message._guild.lvlUpChannel}> (\`${message._guild.lvlUpChannel}\`)`
                      : ""
                  }.`,
            reset: `Okay, the messages are no longer redirected.`,
            red: (channel: TextChannel) =>
              `Okay, I am now redirecting level up messages to ${channel} (\`${channel.id}\`)`,
            enable:
              "Okay, I enabled level up messages! Do `lum disable` to disable them again.",
            disable:
              "Okay, I disabled level up messages! Do `lum enable` to enable them again."
          },
          mtr: {
            desc: {
              content: [
                "Manages the role used when muting a member.",
                "**• clear**: Clears the mute role.",
                "**• set**: Sets the mute role."
              ].join("\n"),
              usage: "[clear|set] <[@role|role name|role id]>",
              examples: [
                "v!muterole",
                "v!muterole clear",
                "v!muterole set @Muted"
              ]
            },
            prompt: "Please provide a role I can use for mutes :/",
            curr: (message: Message) =>
              `The current mute role is ${
                message._guild.muteRole
                  ? `<@&${message._guild.muteRole}> \`(${message._guild.muteRole})\``
                  : "is literally nothing..."
              }`,
            clear:
              "Okay, I cleared the mute role! To set a new one do `muterole set <role>`!",
            set: (role: Role) =>
              `Okay, I set the mute role to ${role} \`(${role.id})\``
          },
          prf: {
            desc: {
              content: [
                "Manages up to 5 prefixes for this guild.",
                "**• add**: Adds a prefix.",
                "**• remove**: Removes an existing prefix."
              ].join("\n"),
              usage: "[add|remove] <[prefix]>",
              examples: ["v!prefix add b!", "v!prefix remove b!", "v!prefix"]
            },
            start: "Provide a prefix with 1-5 characters in length.",
            retry: "Cmon... provide a prefix with 1-5 characters in length.",
            curr: (message: Message) =>
              `This guilds current prefixes are\n${message._guild.prefixes
                .map((prefix, i) => `**${++i}.** ${prefix}`)
                .join("\n")}`,
            exists: "Sorry, this prefix already exists.",
            "5prf": "Sorry, you can only have 5 prefixes :p",
            "5ch": "Prefixes can only be 5 characters in length.",
            added: "Successfully added `{{prefix}}` to the list of prefixes",
            "!exists": "Sorru, that prefix doesn't exist.",
            rmed: (guild: GuildEntity) =>
              `Successfully removed \`{{prefix}}\` from the list of prefixes.${
                guild.prefixes.length > 0
                  ? ""
                  : `\n*to use commands you need to mention the bot* @VorteKore ping`
              }`
          },
          puns: {
            desc: {
              content:
                "Customizes punishments given out at specific warn amounts.",
              usage: "[set|remove] <level> <[type]> <[duration]>",
              examples: [
                "v!punishments new 1 ban 20s",
                "v!punishments del 1",
                "v!punishments new 5 ban"
              ]
            },
            curr: (m: Message) =>
              Object.keys(m._guild.warnPunishments).length > 0
                ? [
                    `The current warn punishments are`,
                    ...Object.keys(m._guild.warnPunishments)
                      .sort((a, b) => a - b)
                      .map(a => {
                        const p = m._guild.warnPunishments[a];
                        return `**${a}**. ${p.type}${
                          p.duration
                            ? ` for \`${ms(p.duration, { long: true })}\``
                            : ""
                        }.`;
                      })
                  ].join("\n")
                : "There are no warn punishments setup.",
            new: (p: WarnPunishment) =>
              `Users that exceed \`{{level}} warns\` will now be *${
                PUNS[p.type]
              }*${
                p.duration ? ` for **${ms(p.duration, { long: true })}**` : ""
              }.`,
            del: `Users will not be punished when they exceed **{{level}} warns**.`,
            del_prompt: "Please provide a level."
          }
        },
        util: {
          ava: {
            desc: {
              content: "Sends an embed that contains a users avatar.",
              usage: "[user]",
              examples: ["v!av 396096412116320258", "v!av", "v!av @2D#5773"]
            }
          },
          bi: {
            desc: {
              content: "Displays info on VorteKore"
            },
            info: `Hello, I'm ${
              this.client.user!.username
            }!, I am a public bot with many uses! If you wish to check out the commands I have, please do \`v!help\`.`
          },
          emb: {
            desc: {
              content: "Creates an embed with provided title and description",
              usage: "<title> | <description>",
              examples: ["!embed Cool guy | I know i am really cool"]
            }
          },
          fb: {
            desc: {
              content: "Provide feedback on the bot!",
              usage: "<thoughts>",
              examples: [
                "!feedback fix stuff",
                "!feedback amazing music quality!"
              ]
            },
            prompt: "Maybe you should put something next time.",
            sent: "Thanks for the feedback! <3"
          },
          help: {
            desc: {
              content: "Shows all the commands VorteKore has to offer.",
              usage: "[command]",
              examples: ["v!help", "v!help ban"]
            }
          },
          img: {
            desc: {
              content: "Provides you image with provided name",
              usage: "",
              examples: ["!image cow"]
            }
          },
          inv: {
            desc: {
              content: "Sends a bot invite with administrator permissions"
            },
            res: `Use [this link]({{invite}}) to invite the bot!`
          },
          ping: {
            desc: {
              content: "Sends the bot & discord api ping."
            },
            res: (bot: number, api: number) =>
              [
                `**Bot Ping**: ${Math.round(bot)}ms`,
                `**API Ping**: ${Math.round(api)}ms`
              ].join("\n")
          },
          stats: {
            desc: {
              content: "Shows some bot statistics"
            }
          },
          ui: {
            desc: {
              content: "Shows info on a member",
              usage: "[@member]",
              examples: ["v!ui 396096412116320258", "v!ui", "v!ui @2D#5773"]
            }
          }
        }
      }
    };
  }
}
