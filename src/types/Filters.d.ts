export type FilterNames = "equalizer" | "karaoke" | "timescale" | "tremolo" | "vibrato" | "volume";

export interface LoadedTracks {
  loadType: LoadTypes;
  tracks?: TrackInfo[];
  playlistInfo?: PlaylistInfo;
  cause?: LoadError;
  severity: string;
}

export interface FilterMap {
  equalizer: Equalizer;
  karaoke: Karaoke;
  timescale: Timescale;
  tremolo: Tremolo;
  vibrato: Vibrato;
}

export type Equalizer = Band[];

export interface Band {
  band: number;
  gain?: number;
}

export interface Karaoke {
  level?: number;
  monoLevel?: number;
  filterBand?: number;
}

export interface Timescale {
  speed?: number;
  pitch?: number;
  rate?: number;
}

export interface Tremolo {
  frequency?: number;
  depth?: number;
}

export interface Vibrato {
  frequency?: number;
  depth?: number;
}
