import { Tracks, ExternalUrls, Image } from ".";
import { Artist } from "./Artist";

export interface Album {
  album_type: string;
  artists: Artist[];
  available_markets: string[];
  copyrights: Copyright[];
  external_ids: ExternalIDS;
  external_urls: ExternalUrls;
  genres: any[];
  href: string;
  id: string;
  images: Image[];
  label: string;
  name: string;
  popularity: number;
  release_date: Date;
  release_date_precision: string;
  total_tracks: number;
  tracks: Tracks;
  type: string;
  uri: string;
}

export interface Copyright {
  text: string;
  type: string;
}

export interface ExternalIDS {
  upc: string;
}

export interface Item {
  artists: Artist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  preview_url: null | string;
  track_number: number;
  type: string;
  uri: string;
}
