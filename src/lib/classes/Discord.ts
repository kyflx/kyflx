import { Message, Structures } from "discord.js";
import { UpdateResult } from "typeorm";
import Queue from "./Queue";
import VorteEmbed from "./VorteEmbed";

Structures.extend(
  "Message",
  (msg) =>
    class VorteMessage extends msg {
      public get player() {
        if (!this.guild) return null;

        return this.client.music.getPlayer(this.guild.id);
      }

      public get queue() {
        if (this.guild) return this.player.queue || new Queue(this.player);
        return null;
      }

      public async update(key: string, value: any): Promise<UpdateResult> {
        return this.client._guilds.set(this.guild, key, value);
      }

      public async sem(
        content: string,
        { type = "base", t = false, _new = false } = {},
        i: Record<string, any> = {}
      ): Promise<Message> {
        const e = (new VorteEmbed(this) as any)[`${type}Embed`]();
        e.setDescription(t ? this.t(content, i) : content);
        return this.util[_new ? "sendNew" : "send"](e);
      }

      public t<T extends any>(key: string, i: Record<string, any> = {}): T {
        const language = this._guild ? this._guild.language : "en_US";
        return this.client.i18n.get(language, key, i);
      }
    }
);
