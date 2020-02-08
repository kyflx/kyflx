import {Command, VorteEmbed} from "@vortekore/lib";
import {Message} from "discord.js";

export default class extends Command {

    public constructor() {
        super("bank", {
            aliases: ["bank"],
            description: t => t("cmds:eco.bk.desc"),
            cooldown: 50000,
            args: [
                {
                    id: "locale",
                    default: "help",
                    type: "string"
                },
                {
                    id: "amount",
                    default: 0,
                    type: "number"
                }
            ]
        });
    }

    public async exec(message: Message, {locale, amount}: { locale: string, amount: number }) {
        const bankEmbed = new VorteEmbed(message)
            .baseEmbed()
            .setTitle("Bank")
            .setDescription([
                message.t("cmds:eco.bk.emdesc"),
                "Deposit: " + message.t("cmds:eco.bk.dep"),
                "Withdraw: " + message.t("cmds:eco.bk.with")
            ].join("\n"));

        switch (locale) {
            case "deposit":
                if (!amount)
                    return message.sem(message.t("cmds:eco.bk.prompt", {locale: "deposit"}), {type: "error"});
                if (isNaN(amount) || amount > message.profile.coins)
                    return message.sem(message.t("cmds:eco.bk.insuf"), {type: "error"});
                if (amount > message.profile.upgrades.bank || amount + message.profile.bank > message.profile.upgrades.bank)
                    return message.sem(message.t("cmds:eco.bk.limit", {max: message.profile.upgrades.bank}));

                message.profile.bank += amount;
                message.profile.coins -= amount;
                message.profile.save().catch();
                message.sem(message.t("cmds:eco.bk.suc", {locale: "deposited", amount}));
                break;
            case "withdraw":
                if (!amount)
                    return message.sem(message.t("cmds:eco.bk.prompt", {locale: "withdraw"}), {type: "error"});
                if (isNaN(amount) || amount > message.profile.bank)
                    return message.sem(message.t("cmds:eco.bk.insuf"), {type: "error"});

                message.profile.bank -= amount;
                message.profile.coins += amount;
                message.profile.save().catch();
                message.sem(message.t("cmds:eco.bk.suc", {locale: "withdrew", amount}));
                break;
            case "help":
                message.channel.send(bankEmbed);
                break;
            default:
                message.channel.send(bankEmbed);
                break;
        }
    }
}
