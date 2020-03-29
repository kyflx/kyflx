import { Counter, Registry } from "prom-client";

export * from "./github-commits";
export * from "./discord-guild";
export * from "./imgur-hot";
export * from "./subreddit-json.js";

export interface Nekos { url: string; }

export interface PaginateResults<T> {
  items: Array<T>;
  page: number;
  maxPage: number;
  pageLength: number;
}

export type BassLevels = "earrape" | "extreme" | "hard" | "soft" | "off";

export interface Stats {
  commands: Counter<string>;
  messages: Counter<string>;
  register: Registry;
}
