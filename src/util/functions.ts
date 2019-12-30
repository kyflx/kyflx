import { GuildMember, Message } from "discord.js";
import fetch, { RequestInit } from "node-fetch";

export function formatString(message: string, member: GuildMember) {
  const obj = {
    "{{mention}}": member.toString(),
    "{{member}}": member.user.tag,
    "{{server}}": member.guild.name,
    "{{memberCount}}": member.guild.memberCount
  }
  const string = message.replace(new RegExp(Object.keys(obj).join("|")), (m) => obj[m as "{{mention}}"])
  return string;
}

export function findRole(message: Message, role: string) {
  return message.mentions.roles.first() || message.guild!.roles.find((r) => {
    const name = r.name.toLowerCase()
    return name === role || name.toLowerCase().startsWith(role);
  })
};

export async function findMember(message: Message, toFind: string) {
  let member;
  if (message.mentions && message.mentions.members!.size == 0 && message.mentions.users.size > 0) {
    const toFetch = await message.guild!.members.fetch(message.mentions.users.first()!);
    return toFetch;
  }
  else {
    if (!toFind) return message.member;
    toFind = toFind.toLowerCase();
    member = message.mentions.members!.first() || message.guild!.members.find((x) => x.user.username.toLowerCase() === toFind) || message.guild!.members.get(toFind);
  }
  return member;
}

export const get = async <T>(url: string, options?: RequestInit): Promise<{ data?: T, error?: Error }> => {
  return new Promise(resolve => {
    return fetch(url, options)
      .then(
        async res => resolve({ data: await res.json() }),
        error => resolve({ error })
      );
  });
}

export function _formatTime(ms: number) {
  let day, hour, minute, seconds;
  seconds = Math.floor(ms / 1000);
  minute = Math.floor(seconds / 60);
  seconds = seconds % 60;
  hour = Math.floor(minute / 60);
  minute = minute % 60;
  day = Math.floor(hour / 24);
  hour = hour % 24;

  return {
    d: day,
    h: hour < 10 ? "0" + hour : hour,
    m: minute < 10 ? "0" + minute : minute,
    s: seconds < 10 ? "0" + seconds : seconds
  }
};

export interface PaginateResults<T> {
  items: T[];
  page: number;
  maxPage: number;
  pageLength: number;
}

export function paginate<T>(items: T[], page = 1, pageLength = 10): PaginateResults<T> {
  const maxPage = Math.ceil(items.length / pageLength);
  if (page < 1) page = 1;
  if (page > maxPage) page = maxPage;
  const startIndex = (page - 1) * pageLength;

  return {
    items: items.length > pageLength ? items.slice(startIndex, startIndex + pageLength) : items,
    page,
    maxPage,
    pageLength
  };
}

export function Installed(id: string): boolean {
  try {
    require(id);
    return true;
  } catch (error) {
    return false;
  }
}

export function shuffle<T extends any[]>(array: T): T {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function formatNumber(n: number) {
  if (n < 1e3) return n;
  if (n >= 1e3) return +(n / 1e3).toFixed(1) + "K";
};

export function isPromise(value: any): boolean {
  return value
    && typeof value.then === 'function'
    && typeof value.catch === 'function';
}
