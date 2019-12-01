import { Command } from "../structures/Command";
import { VorteClient } from "../structures/VorteClient";
import { Message, GuildChannel } from "discord.js";
import { VorteGuild } from "../structures/VorteGuild";
export declare class Cmd extends Command {
    constructor(bot: VorteClient);
    run(message: Message, args: string[], guild: VorteGuild): import("discord.js").MessageEmbed | Promise<Message> | Promise<GuildChannel> | undefined;
}
