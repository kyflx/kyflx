import { GuildMember, Message, MessageAdditions, MessageOptions, VoiceChannel } from "discord.js";
import { Extendable, KlasaMessage } from "klasa";
import { Player } from "lavaclient";
import { Kyflx, Queue, Util } from "../../lib";

export default class MessageExtendable extends Extendable {
  // @ts-ignore
  public constructor(...args) {
    // @ts-ignore
    super(...args, { appliesTo: [Message], name: "message-ext" });
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
    return this.send(this.client.embed(this).setDescription(content), options);
  }

  public inVc(
    this: Message,
    value: string | VoiceChannel | GuildMember
  ): boolean {
    const vc = this.member.voice.channel;
    return Boolean(
      vc
        ? Util.testInstance(value, [
            ["string", (v) => vc.id === v],
            [VoiceChannel, (v) => vc.id === v.id],
            [GuildMember, (v) => vc.members.has(v.id)],
          ])
        : false
    );
  }
}

declare module "discord.js" {
  interface Message {
    client: Kyflx;
    player: Player;
    queue: Queue;
    t(path: string, ...args: any[]): string;
    inVc(vc?: string | GuildMember | VoiceChannel): boolean;
    reply(
      content: string,
      options?: MessageOptions | MessageAdditions
    ): Promise<KlasaMessage>;
  }
}
