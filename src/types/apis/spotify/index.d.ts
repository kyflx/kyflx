import { Item } from "./Playlist";

export { Album } from "./Album"
export { Artist } from "./Artist"
export { Playlist } from "./Playlist"
export { Track } from "./Track"

export interface Followers {
  href:  null;
  total: number;
}

export interface ExternalUrls {
  spotify: string;
}

export interface Image {
  height: number;
  url:    string;
  width:  number;
}

export interface ExternalIDS {
  isrc: string;
}

export interface Owner {
  display_name?: string;
  external_urls: ExternalUrls;
  href:          string;
  id:            string;
  type:          string;
  uri:           string;
  name?:         string;
}

export interface Tracks {
  href:     string;
  items:    Item[];
  limit:    number;
  next:     null;
  offset:   number;
  previous: null;
  total:    number;
}
