"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../structures/Command");
const structures_1 = require("../structures");
const util_1 = require("../util");
class Cmd extends Command_1.Command {
    constructor(bot) {
        super(bot, {
            name: "userinfo",
            category: "Information",
            cooldown: 5000,
            aliases: ["whois", "ui"],
            description: "!ui @user"
        });
    }
    run(message, [mem], guild) {
        return __awaiter(this, void 0, void 0, function* () {
            const member = (yield util_1.findMember(message, mem)) || message.member;
            if (!member)
                return message.channel.send(`Unable to find that member!`);
            const thisMember = yield new structures_1.VorteMember(member.id, message.guild.id)._init();
            const infoEmbed = new structures_1.VorteEmbed(message).baseEmbed().setDescription(`**>** Name: ${member.user.tag}
     **>** Joined At: ${member.joinedAt}
     **>** Created At: ${member.user.createdAt}
     **>** Presence: ${member.presence.status}
     **>** Hoist Role: ${member.roles.hoist}
     **>** Roles: ${member.roles.array().toString().replace('@everyone', '')}
     **>** Level: ${thisMember.level}
     **>** XP: ${thisMember.xp}/${2 * 75 * thisMember.level}
     **>** Coins: ${thisMember.coins}`)
                .setThumbnail(member.user.displayAvatarURL());
            message.channel.send(infoEmbed);
        });
    }
}
exports.Cmd = Cmd;
;
