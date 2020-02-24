import {Command, ProfileEntity} from "@vortekore/lib";
import {GuildMember, Message} from "discord.js";

export default class extends Command {
    public constructor() {
        super("rob", {
            aliases: ["rob"],
            description: t => t("cmds:eco.rb.desc"),
            cooldown: 50000,
            args: [
                {
                    id: "member",
                    type: "member",
                    prompt: {
                        start: (_: Message) => _.t("cmds:eco.rb.prompt")
                    }
                }
            ]
        });
    }

    public async exec(message: Message, {member}: { member: GuildMember | ProfileEntity }) {
        if ((member as GuildMember).id === message.author.id)
            return message.sem(message.t("cmds:eco.rb.we"), {type: "error"});

        // @ts-ignore
        member = await ProfileEntity.findOne({
            where: {
                userId: (member as GuildMember).id,
                guildId: (member as GuildMember).guild.id
            }
        });

        if (Math.random() > 0.60) {
            const amount = Math.floor(Math.random() * member.coins);
            message.profile.coins += amount;
            message.profile.save();
            member.coins -= amount;
            member.save();
            message.sem(message.t("cmds:eco.rb.succ", {member, amount}));
        } else {
            const amount = Math.floor(Math.random() * Math.floor(message.profile.coins / 2));
            message.profile.coins -= amount;
            message.profile.save();
            message.sem(message.t("cmds:eco.rb.lose", {member, amount}))
        }
    }
}

