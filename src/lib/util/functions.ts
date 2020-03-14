import { TrackInfo } from "@lavalink/encoding";
import { Playlist, Video } from "better-youtube-api";
import { Category, Command } from "discord-akairo";
import {
  Collection,
  GuildMember,
  Message,
  MessageEmbed,
  MessageReaction,
  User
} from "discord.js";
import { developers } from ".";
import { GuildEntity } from "..";
import { api } from "../..";
import { Queue } from "../classes";
import { Language } from "../i18n";
import fetch, { RequestInit } from "node-fetch";

export async function searchYT(
  input: string,
  maxResults: number = 10
): Promise<(Video | Playlist)[]> {
  const { results } = await api.search([Video, Playlist], input, maxResults);
  return <(Video | Playlist)[]>results;
}

export function formatString(message: string, member: GuildMember) {
  const obj: Record<string, string> = {
    "{{mention}}": member.toString(),
    "{{member}}": member.user.tag,
    "{{server}}": member.guild.name,
    "{{memberCount}}": member.guild.memberCount.toLocaleString()
  };
  return message.replace(new RegExp(Object.keys(obj).join("|")), m => obj[m]);
}

export const formatNumber = (n: number) =>
  n < 1e3 ? n : +(n / 1e3).toFixed(1) + "K";

export function CategoryPredicate(message: Message) {
  return (c: Category<string, Command>) =>
    ![
      "flag",
      ...(developers.includes(message.author.id)
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
  let subString = str.substr(0, n - 1);
  return (
    (useWordBoundary
      ? subString.substr(0, subString.lastIndexOf(" "))
      : subString) + "..."
  );
}

export const get = async <T>(
  url: string,
  options?: RequestInit
): Promise<{ data?: T; error?: Error }> => {
  return new Promise(resolve => {
    return fetch(url, options).then(
      async res => resolve({ data: await res.json() }),
      error => resolve({ error })
    );
  });
};

export const readPath = (object: string[], data: any): any => {
  if (object.length > 0) {
    data = data[object[0]];
    if (!data) return;
    return readPath(object.slice(1), data);
  }
  return data;
};

export function MafiaEmbed(content: string, guild?: GuildEntity) {
  return new MessageEmbed()
    .setColor(guild ? guild.embedColor : "#0c6dcf")
    .setDescription(content)
    .setFooter("VorteKore Mafia (BETA)")
    .setTimestamp(new Date());
}

export function confirm(message: Message, content: string): Promise<Boolean> {
  return new Promise(async (resolve, reject) => {
    try {
      const embed = new MessageEmbed()
          .setColor("#36393f")
          .setAuthor(message.author.username, message.author.displayAvatarURL())
          .setDescription(content),
        emotes = ["✅", "❌"],
        m = <Message>await message.util!.send(embed);
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

export interface PaginateResults<T> {
  items: T[];
  page: number;
  maxPage: number;
  pageLength: number;
}

export function paginate<T>(
  items: T[],
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
  if (volume == 0) return "\uD83D\uDD07";
  else if (volume < 33) return "\uD83D\uDD08";
  else if (volume < 67) return "\uD83D\uDD09";
  else return "\uD83D\uDD0A";
}

export function formatTime(duration: number) {
  const minutes = Math.floor(duration / 60000);
  const seconds = ((duration % 60000) / 1000).toFixed(0);
  // @ts-ignore
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

export function playerEmbed(
  queue: Queue,
  { np, position }: { np: TrackInfo; position: number }
) {
  return `${progressBar(position / Number(np.length))} \`[${formatTime(
    position
  )}/${formatTime(Number(np.length))}]\``;
}

export function progressBar(percent: number, length = 20) {
  let str = "";
  for (let i = 0; i < length; i++) {
    if (i == Math.round(percent * length)) str += "▬";
    else str += "―";
  }
  return str;
}

export const In = (member: GuildMember) =>
  member.voice.channel
    ? member.voice.channel.members.has(member.guild.me.id)
    : false;

export function getLanguageKeys(message: Message): string[][] {
  return new Collection<string, Language>(
    <any>message.client.i18n.languages.entries()
  ).reduce<string[][]>((keys, language) => {
    keys.push([language.id, ...language.aliases]);
    return keys;
  }, []);
}
