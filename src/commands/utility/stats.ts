import { Command, VorteEmbed } from "@vortekore/lib";
import { Message } from "discord.js";
import OSUtils, { NetStatMetrics } from "node-os-utils";

export default class extends Command {
  public constructor() {
    super("stats", {
      aliases: ["stats", "statistics"],
      description: {
        content: "Shows some bot statistics"
      }
    });
  }

  public async exec(message: Message) {
    return message.util.send(
      new VorteEmbed(message)
        .baseEmbed()
        .addField(
          "General",
          [
            `**Guilds**: ${this.client.guilds.size}`,
            `**Users**: ${this.client.users.size}`,
            `**Channels**: ${this.client.channels.size}`,
            `**Emojis**: ${this.client.emojis.size}`
          ].join("\n"),
          true
        )
        .addField("Advanced", await this.advanced(), true)
        .setThumbnail(this.client.user.displayAvatarURL())
    );
  }

  public async advanced() {
    const { usedMemMb, totalMemMb } = await OSUtils.mem.info(),
      net = (await OSUtils.netstat.inOut()) as NetStatMetrics,
      cpu = await OSUtils.cpu.usage(),
      { heapUsed, heapTotal } = process.memoryUsage();

    return [
      `**Total CPU Usage**: ${Math.round(cpu)}% used`,
      `**Bot Memory**: ${Math.round((heapUsed / 1024 / 1024) * 100) /
        100}MB / ${Math.round((heapTotal / 1024 / 1024) * 100) / 100}MB`,
      `**System Memory**: ${Math.round(usedMemMb)}MB / ${Math.round(
        totalMemMb
      )}MB`,
      `**Network**: \`${net.total.outputMb} ⬆️\` / \`${net.total.inputMb} ⬇️\``,
      `**System Platform**: ${OSUtils.os.type()}`
    ].join("\n");
  }
}
