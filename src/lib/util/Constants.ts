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

export enum SFW_LINKS {
  baka = "https://nekos.life/api/v2/img/baka",
  cat = "https://www.reddit.com/r/cats.json?limit=100",
  cuddle = `https://nekos.life/api/v2/img/cuddle`,
  dog = "https://www.imgur.com/r/dog/hot.json",
  duck = "https://www.reddit.com/r/duck.json?limit=100",
  feed = `https://nekos.life/api/v2/img/feed`,
  fox = "https://www.reddit.com/r/foxes.json?limit=100",
  foxGirl = `https://nekos.life/api/v2/img/fox_girl`,
  holo = `https://nekos.life/api/v2/img/holo`,
  hug = `https://nekos.life/api/v2/img/hug`,
  kemonomimi = `https://nekos.life/api/v2/img/kemonomimi`,
  kiss = `https://nekos.life/api/v2/img/kiss`,
  lizard = `/https://nekos.life/api/v2img/lizard`,
  meme = "https://www.reddit.com/r/dankmemes/top.json?limit=100",
  neko = `https://nekos.life/api/v2/img/neko`,
  nekoGif = `https://nekos.life/api/v2/img/ngif`,
  owl = "https://www.reddit.com/r/owls.json?limit=100",
  panda = "https://www.imgur.com/r/panda/hot.json?limit=100",
  pat = `https://nekos.life/api/v2/img/pat`,
  penguin = "https://www.reddit.com/r/penguin.json?limit=100",
  poke = `https://nekos.life/api/v2/img/poke`,
  slap = `https://nekos.life/api/v2/img/slap`,
  smug = `https://nekos.life/api/v2/img/smug`,
  tickle = `https://nekos.life/api/v2/img/tickle`,
  wolf = "https://www.reddit.com/r/wolves.json?limit=100",
}

export const wordArr: string[] = [
  "computer",
  "laptop",
  "internet",
  "discord",
  "food",
  "water",
  "cow",
  "cat",
  "dog",
  "sheep",
  "jester",
  "math",
  "global",
  "information",
  "game",
  "video",
  "example",
  "paper",
  "rock",
  "mutual",
  "risk",
  "joker",
  "Coco-Cola",
  "message",
  "email"
];

export enum FUN_LINKS {
  why = `https://nekos.life/api/v2/why`,
  catText = `https://nekos.life/api/v2/cat`,
  spoiler = `https://nekos.life/api/v2/spoiler`,
  owoify = `https://nekos.life/api/v2/owoify`,
  "8ball" = `https://nekos.life/api/v2/8ball`,
  fact = `https://nekos.life/api/v2/fact`
}

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
  BOT_LOGS = "613827877015650304"
}

export enum PUNS {
  kick = "kicked",
  ban = "banned",
  warn = "warned",
  mute = "muted"
}
