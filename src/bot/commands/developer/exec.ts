import { exec } from "child_process";
import { Message } from "discord.js";
import { Command } from "../../../lib";

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
    return exec(command, (error, stdout, stderr) => {
      if (error) return message.util.send(`**Error:**\n\`\`\`bash\n${error}\`\`\``)
      if (stderr) return message.util.send(`**Bash Error:**\n\`\`\`bash\n${stderr}\`\`\``)
      return message.util.send(`**Output:**\n\`\`\`bash\n${stdout}\`\`\``)
    });
  }
}
