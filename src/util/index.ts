export * from "./functions";

String.prototype.trunc = function (n: number, useWordBoundary: boolean) {
	if (this.length <= n) return this;
	let subString = this.substr(0, n - 1);
	return (useWordBoundary ? subString.substr(0, subString.lastIndexOf(" ")) : subString) + "...";
}

String.prototype.ignoreCase = function (value: string): boolean {
	return this.toLowerCase() === value.toLowerCase();
}

declare global {
	interface String {
		ignoreCase(value: string): boolean;
		trunc(n: number, useWordBoundary?: boolean): String;
	}
}

export interface RadioObject {
  id: number;
  changeuuid: string;
  stationuuid: string;
  name: string;
  url: string;
  url_resolved: string;
  homepage: string;
  favicon: string;
  tags: string;
  country: string;
  countrycode: string;
  state: string;
  language: string;
  votes: number;
  lastchangetime: string;
  ip: string;
  codec: string;
  bitrate: number;
  hls: number;
  lastcheckok: number;
  lastchecktime: string;
  lastcheckoktime: string;
  clicktimestamp: string;
  clickcount: number;
  clicktrend: number;
}


