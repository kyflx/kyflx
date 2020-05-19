import { Message, User } from "discord.js";
import { Command } from "klasa";
import { OwnerCommand } from "../../../lib";

@OwnerCommand({
  usage: "<add|remove|list> <users:...user|guilds:...guild|items:...str>",
  permissionLevel: 8
})
export default class BlacklistCommand extends Command {
  public terms: string[] = [
    "usersAdded",
    "usersRemoved",
    "guildsAdded",
    "guildsRemoved",
  ];

  public async run(message: Message, [type, ...params]: [string, any]) {
    switch (type) {
      case "add":
        return this.add(message, params);
    }

    return;
  }

  public async add(message: Message, adding: any[]) {
    const changes: string[][] = [[], [], [], []];
    const queries: string[][] = [[], []];

    for (const toAdd of new Set(adding)) {
      const type = toAdd instanceof User ? "user" : "guild";
      if (this.client.settings.get(`${type}Blacklist`).includes(toAdd.id || toAdd)) {
        changes[this.terms.indexOf(`${type}sRemoved`)].push(
          toAdd.name || toAdd.username || toAdd
        );
      } else {
        changes[this.terms.indexOf(`${type}sAdded`)].push(
          toAdd.name || toAdd.username || toAdd
        );
      }
      queries[Number(type === "guild")].push(toAdd.id || toAdd);
    }

    const { errors } = await this.client.settings.update([
      ["userBlacklist", queries[0]],
      ["guildBlacklist", queries[1]],
    ]);
    if (errors.length) throw String(errors[0]);

    return message.sendLocale("COMMAND_BLACKLIST_SUCCESS", changes);
  }
}
