// @ts-nocheck
import { Message, MessageAdditions, MessageOptions } from "discord.js";
import { Extendable, KlasaMessage } from "klasa";
import { Player } from "lavaclient";

import { Kyflx, Queue } from "../../lib";

export default class MessageExtendable extends Extendable {
  public constructor(...args) {
    super(...args, { appliesTo: [Message] });
  }

  public get player(this: Message) {
    return this.client.music.players.get(this.guild.id);
  }

  public get queue(this: Message): Queue {
    return this.player ? this.player.queue : null;
  }

  public t(this: Message, path: string, ...args: any[]): string {
    return this.language.get(path, ...args);
  }

  public reply(
    this: Message,
    content: string,
    options?: MessageOptions | MessageAdditions
  ) {
    return this.channel.send(
      this.client.embed(this).setDescription(content),
      options
    );
  }
}

declare module "discord.js" {
  interface Message {
    client: Kyflx;
    player: Player;
    queue: Queue;
    t(path: string, ...args: any[]): string;
    reply(
      content: string,
      options?: MessageOptions | MessageAdditions
    ): Promise<KlasaMessage>;
  }
}
