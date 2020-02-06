import { Language } from "@vortekore/lib";
import { Role } from "discord.js";
import { GuildMember } from "discord.js";

export default class EnglishTranslations extends Language {
  public constructor() {
    super("en_US", {
      authors: ["MeLike2D"],
      displayName: "English",
      aliases: ["en", "english", "ingles"]
    });
  }

  public get data(): Record<string, any> {
    return {
      cmds: {
        dev: {
          eval: {
            desc: {
              content: "Nothing lol",
              examples: ["veval <code>"],
              usage: "!ban <code>"
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
          panda: {
            desc: {
              content: "Provides a panda picture from imgur"
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
            `I need confirmation to {{action}} **${m.user.tag}** \`(${m.id})\` for reason *"{{reason}}"*`,
          canc: "Okay, I cancelled the command.",
          done: (m: GuildMember) => `{{action}} **${m.user.tag}** \`(${m.id})\` for reason \`{{reason}}\``,
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
          mute: {},
          purge: {},
          warn: {}
        },
        music: {},
        conf: {},
        util: {
          invite: {
            desc: {
              content: "Sends the bot & discord api ping.",
              usage: "[command]",
              examples: ["v!help", "v!help cat"]
            },
            response: `Use [this link]({{invite}}) to invite the bot!`
          },
          help: {
            desc: {
              content: "Shows all the commands VorteKore has to offer."
            }
          },
          ping: {
            desc: {
              content: "Sends the bot & discord api ping."
            },
            response: (bot: number, api: number) =>
              [
                `**Bot Ping**: ${Math.round(bot)}ms`,
                `**API Ping**: ${Math.round(api)}ms`
              ].join("\n")
          }
        }
      }
    };
  }
}
