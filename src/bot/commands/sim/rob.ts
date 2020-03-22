import { GuildMember, Message } from "discord.js";
import { Command, ProfileEntity } from "../../../lib";

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

  public async exec(message: Message, { member }: { member: GuildMember }) {
    if (member.id === message.author.id)
      return message.sem("cmds:eco.rb.we", { type: "error", t: true });

    const profile = await ProfileEntity.findOne({
      where: {
        userId: member.id,
        guildId: member.guild.id
      }
    });

    if (Math.random() >= 0.5) {
      const amt = Math.floor(Math.random() * profile.coins);

      message.profile.coins += amt;
      profile.coins -= amt;
      await message.profile.save();
      await profile.save();

      return message.sem(
        message.t("cmds:eco.rb.succ", { member, amount: amt })
      );
    }

    const amount = Math.floor(
      Math.random() * Math.floor(message.profile.coins / 2)
    );

    message.profile.coins -= amount;
    await message.profile.save();

    return message.sem(message.t("cmds:eco.rb.lose", { member, amount }));
  }
}
