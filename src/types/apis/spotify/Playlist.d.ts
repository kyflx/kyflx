import { ExternalUrls, Followers, Image, Owner, Tracks } from ".";
import { Track } from "./Track";

export interface Playlist {
  collaborative: boolean;
  description:   string;
  external_urls: ExternalUrls;
  followers:     Followers;
  href:          string;
  id:            string;
  images:        Image[];
  name:          string;
  owner:         Owner;
  primary_color: null;
  public:        boolean;
  snapshot_id:   string;
  tracks:        Tracks;
  type:          string;
  uri:           string;
}

export interface Item {
  added_at:        Date;
  added_by:        Owner;
  is_local:        boolean;
  primary_color:   null;
  track:           Track;
  video_thumbnail: VideoThumbnail;
}

export interface VideoThumbnail {
  url: null;
}
