import {Command} from "@vortekore/lib";
import {Message} from "discord.js";

export default class extends Command {

    public constructor() {
        super("gamble", {
            aliases: ["gamble", "g"],
            description: t => t("cmds:eco.gb.desc"),
            cooldown: 50000,
            args: [
                {
                    id: "amount",
                    default: 0,
                    type: "number"
                }
            ]
        });
    }

    public async exec(message: Message, {amount}: { amount: number }) {
        if (!amount)
            return message.sem(message.t("cmds:eco.gb.prompt"), {type: "error"});
        if (isNaN(amount) || amount <= 0 || amount >= 1000)
            return message.sem(message.t("cmds:eco.gb.am"), {type: "error"});
        if (message.profile.coins < amount)
            return message.sem(message.t("cmds:eco.gb.insuf"), {type: "error"});

        if (Math.random() > 0.60) {
            message.profile.coins += amount;
            message.sem(message.t("cmds:eco.gb.win", {coins: amount}));
        } else {
            message.profile.coins -= amount;
            message.sem(message.t("cmds:eco.gb.lose", {coins: amount}));
        }
        message.profile.save().catch()
    }
}
