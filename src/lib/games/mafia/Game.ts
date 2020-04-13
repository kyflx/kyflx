import { Collection, TextChannel } from "discord.js";
import { MafiaEmbed, KyflxClient } from "../../../lib";
import { GuildSettings } from "../../database";
import { MafiaNight } from "./Night";
import { MafiaPlayer } from "./Player";

export type MafiaRole = "villager" | "doctor" | "detective" | "mafia";

const roles: Array<MafiaRole> = ["villager", "doctor", "detective", "mafia"];
export type MafiaChannel = "doctor" | "detective" | "mafia" | "daytime";

export class MafiaGame {
  public night: number = 0;
  public nights: Collection<number, MafiaNight>;
  public channels: Collection<MafiaChannel, TextChannel>;
  public sorted: Collection<MafiaRole, Array<MafiaPlayer>>;
  public started: boolean = false;
  public entry: GuildSettings;

  public constructor(public client: KyflxClient, public guild: string) {
    let i = 0;

    this.entry = client.ensureGuild(guild);
    this.nights = new Collection();
    this.channels = new Collection();
    this.sorted = new Collection(
      Array(4)
        .fill(null)
        .map(() => [roles[i++], []])
    );
  }

  public get players(): Array<MafiaPlayer> {
    const players = [];
    for (const role of this.sorted.array()) players.push(...role);
    return players;
  }

  public setupChannels(channel: (role: MafiaChannel) => TextChannel): void {
    for (const ch of ["doctor", "detective", "mafia", "daytime"] as Array<
      MafiaChannel
    >)
      this.channels.set(ch, channel(ch));
  }

  public addPlayer(id: string) {
    const _r = this.available[
        Math.floor(Math.random() * this.available.length)
      ],
      p = this.sorted.get(_r);

    const player = new MafiaPlayer(this, id, _r);
    return this.sorted.set(_r, [player, ...p]);
  }

  public getPlayer(id: string): MafiaPlayer {
    return this.players.find(p => p.id === id);
  }

  public async start() {
    if (!this.started) this.started = true;

    const daytime = this.channels.get("daytime");
    this.night++;
    const night = new MafiaNight(this, this.night);

    this.sorted.forEach(async (p, r) => {
      const channel = this.channels.get(r as MafiaChannel);
      p.forEach(async ({ id }) => {
        if (channel)
          await channel.updateOverwrite(id, {
            SEND_MESSAGES: false,
            VIEW_CHANNEL: true
          });
        return this.client.users
          .resolve(id)
          .send(
            MafiaEmbed(
              `You are a **${r === "mafia" ? "mafia member" : r}**, Good Luck!`,
              this.entry
            )
          );
      });
    });

    this.nights.set(night.count, night);
    await daytime.updateOverwrite(this.entry.games.mafia.playerRole, {
      SEND_MESSAGES: false,
      VIEW_CHANNEL: true
    });

    return daytime.send(
      MafiaEmbed(
        `It's now **Night ${this.night}**, you cannot talk now.`,
        this.entry
      )
    );
  }

  public async sleep(role?: "detective" | "doctor" | "mafia") {
    const channel = this.channels.get(role || "daytime"),
      daytime = this.channels.get("daytime");
    const overwrite = { SEND_MESSAGES: false, VIEW_CHANNEL: true };

    switch (role) {
      case "detective":
      case "doctor":
      case "mafia":
        this.sorted
          .get(role)
          .forEach(({ id }) => channel.createOverwrite(id, overwrite));
        await daytime.send(MafiaEmbed(`Sleep ${role.capitalize()}.`));
        await channel.send(MafiaEmbed("Sleep!", this.entry));
        break;
      default:
        this.night++;
        this.nights.set(this.night, new MafiaNight(this, this.night));

        await daytime.createOverwrite(
          this.entry.games.mafia.playerRole,
          overwrite
        );
        await daytime.send(
          MafiaEmbed(`It's now **Night ${this.night}**, you cannot talk now.`)
        );
        break;
    }
  }
  public async wake(role?: "detective" | "doctor" | "mafia") {
    const channel = this.channels.get(role || "daytime"),
      daytime = this.channels.get("daytime");
    const overwrite = { SEND_MESSAGES: true, VIEW_CHANNEL: true };

    switch (role) {
      case "detective":
      case "doctor":
      case "mafia":
        this.sorted
          .get(role)
          .forEach(({ id }) => channel.createOverwrite(id, overwrite));
        await daytime.send(MafiaEmbed(`Wakeup ${role.capitalize()}.`));
        await channel.send(MafiaEmbed("Wake Up!"));
        break;
      default:
        await daytime.createOverwrite(
          this.entry.games.mafia.playerRole,
          overwrite
        );
        const wakeup = [
          "🎵 *Rise and Shine!!* 🎵",
          "Good Morning Players!",
          "WAKE UP!!!!"
        ];
        await daytime.send(
          MafiaEmbed(wakeup[Math.floor(Math.random() * wakeup.length)])
        );
        break;
    }
  }

  public toJSON() {
    return {
      nights: this.nights.map(n => n.toJSON()),
      sorted: this.sorted.map(r => r.map(p => p.toJSON())),
      channels: this.channels.toJSON(),
      guild: this.guild
    };
  }

  private get available(): Array<MafiaRole> {
    const _ = [
      ["mafia", this.entry.games.mafia.mafiaLimit],
      ["villager", this.entry.games.mafia.villagerLimit],
      ["detective", this.entry.games.mafia.detectiveLimit],
      ["doctor", this.entry.games.mafia.doctorLimit]
    ];

    return this.sorted.reduce(
      (
        a: Array<MafiaRole>,
        v: Array<MafiaPlayer> | MafiaPlayer,
        k: MafiaRole
      ) =>
        Array.isArray(v)
          ? _.some(r => r[0] === k)
            ? v.length < _.find(r => r[0] === k)[1]
              ? a.concat([k])
              : a
            : a
          : !v
          ? a.concat([k])
          : a,
      []
    );
  }
}
