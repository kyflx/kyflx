import DBLAPI from "./apis/dbl";
import GithubAPI from "./apis/github";
import CovidAPI from "./apis/covid";
import SpotifyAPI from "./apis/spotify";
import YTAPI from "./apis/youtube";
import { NekosLife } from "./apis/nekos.life";
import RedditAPI from "./apis/reddit";

export { default as SpotifyAPI } from "./apis/spotify";
export { default as YTAPI } from "./apis/youtube";

export interface Wrappers extends Record<string, any> {
  dbl: DBLAPI;
  github: GithubAPI;
  covid: CovidAPI;
  spotify: SpotifyAPI;
  youtube: YTAPI;
  nekos: NekosLife;
  imgdit: RedditAPI;
}
