export interface Subreddit {
  kind: string;
  data: Data;
}

interface Data {
  approved_at_utc: null;
  subreddit: string;
  selftext: string;
  author_fullname: string;
  saved: boolean;
  mod_reason_title: null;
  gilded: number;
  clicked: boolean;
  title: string;
  link_flair_richtext: any[];
  subreddit_name_prefixed: string;
  hidden: boolean;
  pwls: number;
  link_flair_css_class: string;
  downs: number;
  thumbnail_height: number;
  hide_score: boolean;
  name: string;
  quarantine: boolean;
  link_flair_text_color: string;
  upvote_ratio: number;
  author_flair_background_color: null;
  subreddit_type: string;
  ups: number;
  total_awards_received: number;
  media_embed: MediaEmbed;
  thumbnail_width: number;
  author_flair_template_id: null;
  is_original_content: boolean;
  user_reports: any[];
  secure_media: null;
  is_reddit_media_domain: boolean;
  is_meta: boolean;
  category: null;
  secure_media_embed: MediaEmbed;
  link_flair_text: string;
  can_mod_post: boolean;
  score: number;
  approved_by: null;
  author_premium: boolean;
  thumbnail: string;
  edited: boolean;
  author_flair_css_class: null;
  author_flair_richtext: any[];
  gildings: Gildings;
  post_hint: string;
  content_categories: null;
  is_self: boolean;
  mod_note: null;
  created: number;
  link_flair_type: string;
  wls: number;
  removed_by_category: null;
  banned_by: null;
  author_flair_type: string;
  domain: string;
  allow_live_comments: boolean;
  selftext_html: null;
  likes: null;
  suggested_sort: null;
  banned_at_utc: null;
  view_count: null;
  archived: boolean;
  no_follow: boolean;
  is_crosspostable: boolean;
  pinned: boolean;
  over_18: boolean;
  preview: Preview;
  all_awardings: AllAwarding[];
  awarders: any[];
  media_only: boolean;
  link_flair_template_id: string;
  can_gild: boolean;
  spoiler: boolean;
  locked: boolean;
  author_flair_text: null;
  treatment_tags: any[];
  visited: boolean;
  removed_by: null;
  num_reports: null;
  distinguished: null;
  subreddit_id: string;
  mod_reason_by: null;
  removal_reason: null;
  link_flair_background_color: string;
  id: string;
  is_robot_indexable: boolean;
  report_reasons: null;
  author: string;
  discussion_type: null;
  num_comments: number;
  send_replies: boolean;
  whitelist_status: string;
  contest_mode: boolean;
  mod_reports: any[];
  author_patreon_flair: boolean;
  author_flair_text_color: null;
  permalink: string;
  parent_whitelist_status: string;
  stickied: boolean;
  url: string;
  subreddit_subscribers: number;
  created_utc: number;
  num_crossposts: number;
  media: null;
  is_video: boolean;
}

interface AllAwarding {
  giver_coin_reward: number | null;
  subreddit_id: null;
  is_new: boolean;
  days_of_drip_extension: number;
  coin_price: number;
  id: string;
  penny_donate: number | null;
  coin_reward: number;
  icon_url: string;
  days_of_premium: number;
  icon_height: number;
  resized_icons: ResizedIcon[];
  icon_width: number;
  start_date: null;
  is_enabled: boolean;
  description: string;
  end_date: null;
  subreddit_coin_reward: number;
  count: number;
  name: string;
  icon_format: null | string;
  award_sub_type: string;
  penny_price: number | null;
  award_type: string;
}

interface ResizedIcon {
  url: string;
  width: number;
  height: number;
}

interface Gildings {
  gid_1: number;
}

interface MediaEmbed {
}

interface Preview {
  images: Image[];
  enabled: boolean;
}

interface Image {
  source: ResizedIcon;
  resolutions: ResizedIcon[];
  variants: MediaEmbed;
  id: string;
}

export interface Imgur {
  id: number;
  hash: string;
  author: string;
  account_id: null;
  account_url: null;
  title: string;
  score: number;
  size: number;
  views: string;
  is_album: boolean;
  album_cover: null;
  album_cover_width: number;
  album_cover_height: number;
  mimetype: string;
  ext: string;
  width: number;
  height: number;
  animated: boolean;
  looping: boolean;
  reddit: string;
  subreddit: string;
  description: string;
  create_datetime: string;
  bandwidth: string;
  timestamp: string;
  section: string;
  nsfw: boolean;
  prefer_video: boolean;
  video_source: null;
  video_host: null;
  num_images: number;
  in_gallery: boolean;
  favorited: boolean;
  adConfig: AdConfig;
}

interface AdConfig {
  safeFlags: string[];
  highRiskFlags: any[];
  unsafeFlags: string[];
  wallUnsafeFlags: any[];
  showsAds: boolean;
}
