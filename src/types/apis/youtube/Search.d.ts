export interface SearchResult {
  kind: string;
  etag: string;
  nextPageToken: string;
  regionCode: string;
  pageInfo: PageInfo;
  items: Item[];
}

export interface Item {
  kind: ItemKind;
  etag: string;
  id: ID;
  snippet: Snippet;
}

interface ID {
  kind: IDKind;
  videoId: string;
}

enum IDKind {
  YoutubeVideo = "youtube#video",
  YoutubePlaylist = "youtube#playlist"
}

enum ItemKind {
  YoutubeSearchResult = "youtube#searchResult",
}

interface Snippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: Thumbnails;
  channelTitle: string;
  liveBroadcastContent: LiveBroadcastContent;
  publishTime: string;
}

enum LiveBroadcastContent {
  None = "none",
}

interface Thumbnails {
  default: Default;
  medium: Default;
  high: Default;
}

interface Default {
  url: string;
  width: number;
  height: number;
}

interface PageInfo {
  totalResults: number;
  resultsPerPage: number;
}
