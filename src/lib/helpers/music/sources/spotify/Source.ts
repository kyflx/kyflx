import { Kyflx } from "../../../../Client";
import { Song, SongSource } from "../../lib";
import { SpotifySong } from "./Song";

export class Spotify extends SongSource {
  static get handlers() {
    return [
      {
        regex: [
          /^(?:https?:\/\/|)?(?:www\.)?open\.spotify\.com\/track\/([a-zA-Z\d-_]+)/,
          /spotify:track:([a-zA-Z\d-_]+)$/,
        ],
        fn: Spotify.provideTrack,
      },
    ];
  }

  private static async provideTrack(
    [ , id ]: [ never, string ],
    client: Kyflx
  ): Promise<Song> {
    const track = await client.apis.api("spotify").track(id);
    const video = await SongSource.closestTitle(client, `${track.artists[0].name} - ${track.name}`);

    if (video) {
      try {
        const res = await client.music.ideal[0].rest.resolve(video.id.videoId);
        return new SpotifySong(res.tracks[0], track, track.album);
      } catch (error) {
        Spotify.log.error(error);
      }
    }
  }
}
