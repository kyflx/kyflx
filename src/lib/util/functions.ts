import { Playlist, Video } from "better-youtube-api";
import { GuildMember } from "discord.js";
import { TrackInfo } from "@lavalink/encoding";
import { Collection } from "discord.js";
import { Message } from "discord.js";
import { Language } from "../i18n";
import { Queue } from "../classes";
import { api } from "../..";

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
  return `${getVolumeIcon(queue.player.volume)} ${
    queue.player.paused ? "\u23F8" : "\u25B6"
  } ${progressBar(position / Number(np.length))} \`[${formatTime(
    position
  )}/${formatTime(Number(np.length))}]\``;
}

export function progressBar(percent: number, length = 10) {
  let str = "";
  for (let i = 0; i < length; i++) {
    if (i == Math.round(percent * length)) str += "\uD83D\uDD18";
    else str += "▬";
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
