import { Command, VorteMessage } from "@vortekore/lib";

export default class extends Command {
  constructor() {
    super("invite", {
      category: "Information",
      cooldown: 0
    });
  }

  async run(message: VorteMessage) {
    return message.sem("Use this link to invite the bot: <http://bit.ly/2EmfskO>");
  }
}
