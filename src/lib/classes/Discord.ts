import { Message, Structures } from "discord.js";
import { Player } from "lavalink";
import Queue from "./Queue";
import VorteEmbed from "./VorteEmbed";

Structures.extend(
  "Message",
  msg =>
    class VorteMessage extends msg {
      public get player(): Player {
        if (!this.guild) return null;
        return this.client.music.players.get(this.guild.id);
      }

      public get queue(): Queue {
        if (!this.guild || !this.player) return null;
        return this.player.queue || new Queue(this.player);
      }

      public sem(
        content: string,
        { type = "base", t = false, _new = false } = {},
        i: Record<string, any> = {}
      ): Promise<Message> {
        const e = (<any>new VorteEmbed(this))[`${type}Embed`]();
        e.setDescription(t ? this.t(content, i) : content);
        return <Promise<Message>>this.util![_new ? "sendNew" : "send"](e);
      }

      public t<T extends any>(key: string, i: Record<string, any> = {}): T {
        const language = this._guild ? this._guild.language : "en_US";
        return this.client.i18n.get(language, key, i);
      }
    }
);
