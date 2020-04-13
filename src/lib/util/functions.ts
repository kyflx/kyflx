import { decode } from "@lavalink/encoding";
import { Playlist, Video } from "better-youtube-api";
import { Category, Command } from "discord-akairo";
import {
  Collection,
  GuildMember,
  Message,
  MessageEmbed,
  MessageReaction,
  Snowflake,
  User
} from "discord.js";
// tslint:disable-next-line: no-implicit-dependencies
import fetch, { RequestInit } from "node-fetch";

import { developers } from ".";
import { api } from "../..";
import { NowPlaying } from "../classes";
import { GuildEntityChannels, GuildLogsMap, GuildSettings } from "../database";
import { Language } from "../i18n";
import { PaginateResults } from "../typings";

export async function searchYT(
  input: string,
  maxResults: number = 10
): Promise<Array<Video | Playlist>> {
  const { results } = await api.search([Video, Playlist], input, maxResults);
  return results as Array<Video | Playlist>;
}

export function ArrToBands(bands: Array<number>) {
  return bands.map((gain, band) => ({ band, gain }));
}

export function formatString(message: string, member: GuildMember) {
  const obj: Record<string, string> = {
    "{{mention}}": member.toString(),
    "{{member}}": member.user.tag,
    "{{server}}": member.guild.name,
    "{{memberCount}}": member.guild.memberCount.toLocaleString()
  };
  return message.replace(
    // tslint:disable-next-line: tsr-detect-non-literal-regexp
    new RegExp(`${Object.keys(obj).join("|")}`),
    m => obj[m]
  );
}

export const formatNumber = (n: number) =>
  n < 1e3 ? n : +(n / 1e3).toFixed(1) + "K";

export function CategoryPredicate(message: Message) {
  return (c: Category<string, Command>) =>
    ![
      "flag",
      ...(developers.includes(message.author.id) || !message.guild
        ? []
        : message.member.hasPermission("MANAGE_GUILD", {
            checkAdmin: true,
            checkOwner: true
          })
        ? ["developer"]
        : ["staff", "settings", "developer"])
    ].includes(c.id);
}
export function trunc(
  str: string,
  n: number,
  useWordBoundary: boolean
): string {
  if (str.length <= n) return str;
  const subString = str.substr(0, n - 1);
  return (
    (useWordBoundary
      ? subString.substr(0, subString.lastIndexOf(" "))
      : subString) + "..."
  );
}

export function DJP(message: Message) {
  if (
    developers.includes(message.author.id) ||
    message.member.hasPermission("ADMINISTRATOR")
  )
    return;
  if (
    message._guild.djRole &&
    message.member.roles.resolve(message._guild.djRole)
  )
    return "DJ";
}

export function log(
  settings: GuildSettings,
  type: keyof GuildLogsMap,
  chan: keyof GuildEntityChannels
): { channel: Snowflake; enabled: boolean } {
  const channel = settings.channels[chan];
  const enabled = !!settings.logs[type];
  return { channel, enabled };
}

export const get = async <T>(
  url: string,
  options?: RequestInit
): Promise<{ data?: T; error?: Error }> => {
  return new Promise(async resolve => {
    return fetch(url, options).then(
      async res => resolve({ data: await res.json() }),
      error => resolve({ error })
    );
  });
};

export function MafiaEmbed(content: string, settings?: GuildSettings) {
  return new MessageEmbed()
    .setColor(settings ? settings.embedColor : "#0c6dcf")
    .setDescription(content)
    .setFooter("Kyflx Mafia (BETA)")
    .setTimestamp(new Date());
}

export async function confirm(
  message: Message,
  content: string
): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    try {
      const embed = new MessageEmbed()
          .setColor("#36393f")
          .setAuthor(message.author.username, message.author.displayAvatarURL())
          .setDescription(content),
        emotes = ["✅", "❌"],
        m = await message.util.send(embed);
      await Promise.all(emotes.map(m.react.bind(m)));

      m.awaitReactions(
        (r: MessageReaction, u: User) =>
          emotes.includes(r.emoji.name) && u.id === message.author.id,
        {
          errors: ["time"],
          max: 1,
          time: 15000
        }
      )
        .then(async reacted => {
          await m.reactions.removeAll();
          if (!reacted.size) return resolve(false);
          return resolve(reacted.first().emoji.name === "✅");
        })
        .catch(() => resolve(false));
    } catch (error) {
      message.client.logger.error(error, `Functions#confirm`);
      return reject(error);
    }
  });
}

export function paginate<T>(
  items: Array<T>,
  page = 1,
  pageLength = 10
): PaginateResults<T> {
  const maxPage = Math.ceil(items.length / pageLength);
  if (page < 1) page = 1;
  if (page > maxPage) page = maxPage;
  const startIndex = (page - 1) * pageLength;

  return {
    items:
      items.length > pageLength
        ? items.slice(startIndex, startIndex + pageLength)
        : items,
    page,
    maxPage,
    pageLength
  };
}

export function isPromise(value: any): boolean {
  return (
    value &&
    typeof value.then === "function" &&
    typeof value.catch === "function"
  );
}

export function getVolumeIcon(volume: number) {
  if (volume === 0) return "\uD83D\uDD07";
  if (volume < 33) return "\uD83D\uDD08";
  if (volume < 67) return "\uD83D\uDD09";
  return "\uD83D\uDD0A";
}

export function formatTime(duration: number) {
  const minutes = Math.floor(duration / 60000);
  const seconds = ((duration % 60000) / 1000).toFixed(0);
  // @ts-ignore
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

export function playerEmbed(current: NowPlaying) {
  const np = decode(current.song);
  return `${progressBar(current.position / Number(np.length))} \`[${formatTime(
    current.position
  )}/${formatTime(Number(np.length))}]\``;
}

export function progressBar(percent: number, length = 20) {
  let str = "";
  for (let i = 0; i < length; i++) {
    if (i === Math.round(percent * length)) str += "▬";
    else str += "―";
  }
  return str;
}

export function In(member: GuildMember) {
  return member.voice.channel
    ? member.voice.channel.members.has(member.guild.me.id)
    : false;
}

export function getLanguageKeys(message: Message): Array<Array<string>> {
  return new Collection<string, Language>(
    message.client.i18n.languages.entries() as any
  ).reduce<Array<Array<string>>>((keys, language) => {
    keys.push([language.id, ...language.aliases]);
    return keys;
  }, []);
}
