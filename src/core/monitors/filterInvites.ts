import { Message } from "discord.js";
import { Monitor, MonitorOptions } from "klasa";
import { Init } from "../../lib";

const REGEX = /(?:https?:\/\/)?(?:www\.)?(?:discord\.(?:gg|li|me|io)|(?:discordapp|discord)\.com\/invite)\/(?<invite>.+)/;

interface InviteFilter {
  enabled: boolean;
  whitelist?: string[];
  blacklist?: string[];
}

@Init<MonitorOptions>({
  name: "inviteFilter",
  enabled: true,
  ignoreSelf: true,
  ignoreOthers: false,
})
export default class extends Monitor {
  public async run(message: Message) {
    if (await message.hasAtLeastPermissionLevel(5)) return null;

    const filter = message.guildSettings.get<InviteFilter>("inviteFilter");

    if (!filter.enabled) return null;
    if (!REGEX.test(message.content)) return null;

    const [, invite] = REGEX.exec(message.content);

    if (filter.whitelist && filter.whitelist.includes(invite)) return null;
    if (!filter.blacklist || filter.blacklist.length !> 0) return message.delete();
    if (filter.blacklist.includes(invite)) return message.delete();

    return null;
  }
}
