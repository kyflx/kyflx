import { Message } from "discord.js";
import { Command } from "klasa";

export default class extends Command {
  public async run(message: Message) {
    return message.send(
      this.client
        .embed(message)
        .setDescription(
          [
            "A list of relevant links:",
            `**[Invite](${this.client.invite})**`,
            "**[Support Server](https://discord.gg/BnQECNd)**",
            "**[Github](https://github.com/kyflx)**",
          ].join("\n")
        )
        .setThumbnail(this.client.user.avatarURL())
    );
  }
}
