import {Language} from "@vortekore/lib";
import {Collection, GuildMember, Message, Role} from "discord.js";

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
                    gb: {
                        desc: {
                            content: "",
                            usage: "<amount>",
                            examples: ["v!gamble 200"]
                        },
                        prompt: "How much do you want to gamble?",
                        insuf: "You don't have enough coins for that!",
                        am: "The number must be between 0-1000!",
                        win: "You've won {{coins}} coins!",
                        lose: "You've lost {{coins}} coins :( !"
                    },
                    bk: {
                        desc: {
                            content: "Withdraws or Deposits money",
                            usage: "<locale> [amount]",
                            examples: ["v!bank withdraw 200"]
                        },
                        prompt: "How much do you want to {{locale}}?",
                        limit: "Limit for your Bank: {{max}}",
                        emdesc: "Withdraw or Deposit money into your Bank!",
                        dep: "Deposit money to the Bank, example: v!bank deposit 200",
                        with: "Withdraw money from the Bank, example: v!bank withdraw 200",
                        suc: "Successfully {{locale}} {{amount}} coins!",
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
                            "The avaliable levels are **high**, **medium**, **low**, and **none**.",
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
                        desc: {content: "Pauses the player if not already resumed."},
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
                        look: "Sorry, I couldn't find what you were looking for :/"
                    },
                    queue: {
                        desc: {
                            content: "Shows the current and next up songs."
                        },
                        empty: (message: Message) =>
                            `Hmmmm... pretty empty, you should add some more songs with **${message.util.parsed.prefix}play**`,
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
                        prompt: "Provide a valid number between **1**-**100**."
                    }
                },
                conf: {
                    dj: {
                        desc: {
                            content:
                                "Manages the role used for controlling the music player.",
                            usage: "[clear|set] <[@role|role name|role id]>",
                            examples: ["v!djrole", "v!djrole clear", "v!djrole set @Muted"]
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
                    logs: {},
                    mtr: {},
                    prf: {}
                },
                util: {
                    ava: {},
                    bi: {},
                    emb: {},
                    fb: {},
                    help: {
                        desc: {
                            content: "Shows all the commands VorteKore has to offer."
                        }
                    },
                    img: {},
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
                    stats: {},
                    ui: {}
                }
            }
        };
    }
}
