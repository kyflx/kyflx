import {Command} from "@vortekore/lib";
import {Message} from "discord.js";

export default class extends Command {
    public constructor() {
        super("crime", {
            aliases: ["crime"],
            description: t => t("cmds:eco.cr.desc"),
            cooldown: 50000,
        });
    }

    public async exec(message: Message) {
        let crime = message.t("cmds:eco.cr.crimes");
        crime = crime[Math.floor(Math.random() * crime.length)];
        const amount = Math.floor(Math.random() * message.profile.coins);
        if (Math.random() > 0.60) {
            message.sem(message.t("cmds:eco.cr.succ", {crime, amount}));
            message.profile.coins += amount;
        } else {
            message.sem(message.t("cmds:eco.cr.lose", {crime, amount}));
            message.profile.coins -= amount;
        }
        message.profile.save();
    }
}
