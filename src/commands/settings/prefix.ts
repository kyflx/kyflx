import { Command, VorteMessage, equalsIgnoreCase } from "@vortekore/lib";

export default class extends Command {
  public constructor() {
    super("prefix", {
      aliases: ["prefixes"],
      description: "Manages the guild prefix.",
      usage: "[prefix]",
      channel: "guild",
      userPermissions: ["MANAGE_GUILD"],
      category: "Settings",
      disabled: true
    });
  }

  public async run(message: VorteMessage, [action, prefix]: string[]) {
    if (!(action && prefix)) {
      return message.sem(
        `This guilds current prefixes are\n${message._guild.prefixes.map(
          (prefix, i) => `**${++i}.** ${prefix}`
        ).join("\n")}`
      );
    }

    const guild = message._guild;
    switch (action) {
      case "add":
        if (guild.prefixes.some(s => equalsIgnoreCase(s, prefix))) {
          message.sem(`Sorry, this prefix already exists.`, {
            type: "error"
          });
          break;
        }

        if (guild.prefixes.length >= 5) {
          message.sem("Sorry, you can only have 5 prefixes :p", {
            type: "error"
          });
          break;
        }

        if (prefix.length > 5) {
          message.sem("Prefixes can only be 5 characters in length.", {
            type: "error"
          });
          break;
        }

        guild.prefixes.push(prefix);
        await guild.save();
        message.sem(
          `Successfully added \`${prefix}\` to the list of prefixes!`
        );
        break;
      case "remove":
        if (!guild.prefixes.some(s => equalsIgnoreCase(s, prefix))) {
          message.sem(`Sorry, that prefix doesn't exist.`, {
            type: "error"
          });
          break;
        }

        const index = guild.prefixes.findIndex(s =>
          equalsIgnoreCase(s, prefix)
        );
        guild.prefixes.splice(index, 1);

        await guild.save();
        message.sem(
          `Successfully removed \`${prefix}\` from the list of prefixes.${
            guild.prefixes.length > 0
              ? ""
              : `\n*to use commands you need to mention the bot* @VorteKore ping`
          }`
        );
        break;
    }
  }
}
