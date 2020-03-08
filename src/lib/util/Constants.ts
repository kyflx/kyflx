export const channelKeys = ["channel", "memberJoined", "memberLeave"];

export const developers = ["396096412116320258", "464499620093886486"];

export const logs = [
  "warn",
  "editMessage",
  "roleAdd",
  "mute",
  "deleteMessage",
  "kick",
  "purge",
  "roleRemove",
  "ban"
];

export const BassLevels: Record<string, number> = {
  high: 0.2,
  medium: 0.1,
  low: 0.05,
  none: 0
};

export const UwU_Faces = [
  "(*^ω^)",
  "(◕‿◕✿)",
  "(◕ᴥ◕)",
  "ʕ•ᴥ•ʔ",
  "ʕ￫ᴥ￩ʔ",
  "(*^.^*)",
  "owo",
  "(｡♥‿♥｡)",
  "uwu",
  "(*￣з￣)",
  ">w<",
  "^w^",
  "(つ✧ω✧)つ",
  "(/ =ω=)/"
];

export const results: Record<"rock" | "paper" | "scissors", string[]> = {
    rock: ["tie", "lost", "win"],
    paper: ["win", "tie", "lost"],
    scissors: ["lost", "win", "tie"]
  },
  RPS_Types = Object.keys(results);

export const MC_Emotes: Record<string, string> = {
  idle: "<:idle:677400656855826442>",
  dnd: "<:dnd:677400656906027008>",
  online: "<:online:677400656897900547>",
  offline: "<:offline:677400656696442902>"
};

export const Presences: Record<string, string> = {
  dnd: "Do Not Disturb",
  online: "Online",
  idle: "Idling",
  offline: "Offline"
};

export enum LogChannels {
  GUILDS = "613827877015650304"
}

export enum PUNS {
  kick = "kicked",
  ban = "banned",
  warn = "warned",
  mute = "muted"
}
