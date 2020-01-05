import { GuildMember } from "discord.js";

export function formatString(message: string, member: GuildMember) {
  const obj = {
    "{{mention}}": member.toString(),
    "{{member}}": member.user.tag,
    "{{server}}": member.guild.name,
    "{{memberCount}}": member.guild.memberCount
  };
  const string = message.replace(
    new RegExp(Object.keys(obj).join("|")),
    m => obj[m as "{{mention}}"]
  );
  return string;
}

export function formatNumber(n: number) {
  if (n < 1e3) return n;
  if (n >= 1e3) return +(n / 1e3).toFixed(1) + "K";
}

export function isPromise(value: any): boolean {
  return (
    value &&
    typeof value.then === "function" &&
    typeof value.catch === "function"
  );
}
