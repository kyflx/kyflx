import {createCanvas, loadImage} from "canvas";
import {Message, MessageAttachment} from "discord.js";
import {formatNumber} from "../../util";
import {join} from "path";
import {Command, ProfileEntity, VorteEmbed} from "@vortekore/lib";

export default class extends Command {
    public constructor() {
        super("profile", {
            aliases: ["profile", "me"],
            description: t => t("cmds:eco.prf.desc"),
            channel: "guild"
        });
    }

    public async exec(message: Message, args: string[]) {
        switch (args[0]) {
            case "set":
                switch (args[1]) {
                    case "bio":
                    case "biography":
                        message.profile!.bio = args.slice(2).join(" ");
                        message.sem(message.t("cmds:eco.prf.new_bio"));
                        await message.profile!.save();
                        break;
                    default:
                        message.sem(message.t("cmds:eco.prf.settings"));
                        break;
                }
                break;
            default:
                const {level, xp} = message.profile!;
                let users = await ProfileEntity.find({
                    where: {guildId: message.guild!.id}
                });
                users = users.sort((a, b) => b.xp - a.xp);
                const rank =
                    users.findIndex(user => user.userId === message.author.id) + 1;

                const canvas = createCanvas(500, 200);
                const ctx = canvas.getContext("2d");
                const xpNeed = 2 * (75 * level);
                const image = await loadImage(
                    join(process.cwd(), "images/rank-card.png")
                );
                const pfp = await loadImage(
                    message.author.displayAvatarURL().replace(".webp", ".png")
                );
                const lineLength = Math.round((xp / xpNeed) * 458);

                ctx.lineWidth = 20;
                ctx.font = "18px Impact";
                ctx.fillStyle = "#00000";

                pfp.width = 310;
                pfp.height = 310;
                ctx.drawImage(pfp, 186, 36);
                ctx.drawImage(image, 0, 0);
                ctx.fillText(message.author.username, 40, 85);
                ctx.fillText(`[${formatNumber(level)}]`, 102, 153);
                ctx.fillText(`[${formatNumber(xp)}/${formatNumber(xpNeed)}]`, 397, 153);
                ctx.fillText(`#${formatNumber(rank)}`, 350, 60);
                ctx.moveTo(40, 170);
                ctx.lineTo(lineLength, 170);
                ctx.lineCap = "round";
                ctx.strokeStyle = "#4b62fa";
                ctx.stroke();

                const attachment = new MessageAttachment(
                    canvas.toBuffer(),
                    `RankCard-${message.author.username}.png`
                );
                const embed = new VorteEmbed(message)
                    .baseEmbed()
                    .setTitle(message.author.username)
                    .addField("Economy", [`**Coins:** ${message.profile.coins}[Bank: ${message.profile.bank}]`].join("\n"), true)
                    .addField("General", [`**Highest Role:** ${message.member.roles.highest}`].join("\n"), true)
                    .addField("Description", message.profile.bio)
                    .setImage(`attachment://RankCard-${message.author.username}.png`);

                message.util.send({embed, files: [attachment]});
                break;
        }
    }
}
