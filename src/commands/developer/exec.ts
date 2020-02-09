import { Command, VorteEmbed } from "@vortekore/lib";
import { Message } from "discord.js";
import ms = require("ms");
import { exec } from "child_process";

export default class extends Command {
  public constructor() {
    super("exec", {
      aliases: ["exec", "execute"],
      description: t => t("cmds:dev.eval.desc"),
      ownerOnly: true,
      args: [
        {
          id: "command",
          prompt: {
            start: "Provide a command to execute"
          },
          match: "rest"
        }
      ]
    });
  }

  public async exec(message: Message, { command }: { command: string }) {
    const proc = exec(command, (error, stdout) => {
      if (error)
        return message.util.send(
          new VorteEmbed(message)
            .errorEmbed()
            .addField("Input", `\`\`\`js\n${command}\`\`\``)
            .addField("Error", `\`\`\`js\n${error}: ${error}\`\`\``)
        );

      return message.util.send(
        new VorteEmbed(message)
          .baseEmbed()
          .addField("Input", `\`\`\`js\n${command}\`\`\``)
          .addField("Output", `\`\`\`js\n${stdout}\`\`\``)
      );
    });
    return proc.kill("SIGKILL");
  }
}
