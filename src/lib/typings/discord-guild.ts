export interface GETServers {
  invite: string;
  guilds: Array<Guild>;
  user: User;
  isAuthenticated: boolean;
}

export interface Guild {
  id: string;
  name: string;
  icon: null | string;
  owner: boolean;
  permissions: number;
  features: Array<Feature>;
  joined?: boolean;
  _guild?: GuildClass | null;
}

export interface GuildClass {
  members: Array<string>;
  channels: Array<string>;
  roles: Array<string>;
  deleted: boolean;
  id: string;
  shardID: number;
  name: string;
  icon: string;
  splash: null;
  region: string;
  memberCount: number;
  large: boolean;
  features: Array<any>;
  applicationID: null;
  afkTimeout: number;
  afkChannelID: null;
  systemChannelID: null;
  premiumTier: number;
  premiumSubscriptionCount: number;
  verificationLevel: number;
  explicitContentFilter: number;
  mfaLevel: number;
  joinedTimestamp: number;
  defaultMessageNotifications: string;
  systemChannelFlags: number;
  vanityURLCode: null;
  description: null;
  banner: null;
  ownerID: string;
  emojis: Array<string>;
  createdTimestamp: number;
  nameAcronym: string;
  iconURL: string;
  splashURL: null;
  bannerURL: null;
}

export enum Feature {
  AnimatedIcon = "ANIMATED_ICON",
  Banner = "BANNER",
  Commerce = "COMMERCE",
  Discoverable = "DISCOVERABLE",
  EnabledDiscoverableBefore = "ENABLED_DISCOVERABLE_BEFORE",
  Featurable = "FEATURABLE",
  InviteSplash = "INVITE_SPLASH",
  MoreEmoji = "MORE_EMOJI",
  News = "NEWS",
  Partnered = "PARTNERED",
  Public = "PUBLIC",
  VanityURL = "VANITY_URL",
  Verified = "VERIFIED",
  VipRegions = "VIP_REGIONS"
}

export interface User {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  verified: boolean;
  locale: string;
  mfa_enabled: boolean;
  flags: number;
  provider: string;
  accessToken: string;
  guilds: Array<Guild>;
  fetchedAt: string;
}
