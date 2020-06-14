import fetch, { RequestInit } from "node-fetch";
import { APIWrapper, APIWrapperOptions } from "@kyflx-dev/util";
import { URLSearchParams } from "url";
import { Init } from "../../lib";

type SortType =
  "cases"
  | "todayCases"
  | "deaths"
  | "todayDeaths"
  | "recovered"
  | "active"
  | "critical"
  | "casesPerOneMillion"
  | "deathsPerOneMillion";

interface FetchCountriesOptions {
  yesterday?: boolean;
  sort?: SortType;
}

@Init<APIWrapperOptions>({ url: "https://corona.lmao.ninja/v2" })
export default class CovidAPI extends APIWrapper {
  /**
   * Get all statistics.
   * @param yesterday - Whether to get statistics for yesterday.
   */
  public all(yesterday: boolean = false): Promise<AllStatistics> {
    return new Promise((resolve) => {
      this.request(`/all?${new URLSearchParams({ yesterday: `${yesterday}` })}`)
        .then((res) => resolve(res.json()))
        .catch((err) => this.logger.error(err));
    });
  }

  /**
   * Fetch a country's covid statistics.
   * @param name - The name of the country you want to fetch.
   * @param yesterday - Whether to get yesterdays statistics.
   */
  public country(name: string, yesterday: boolean = false): Promise<Country> {
    const query = new URLSearchParams({ yesterday: yesterday.toString() });
    return new Promise((resolve) => {
      this.request(`/countries/${name ?? ""}?${query}`)
        .then((res) => resolve(res.json()))
        .catch((err) => this.logger.error(err));
    });
  }

  /**
   * Get all of the countries affected by corona virus.
   * @param options - Options to use when requesting all of the countries.
   */
  public countries(options: FetchCountriesOptions = {}): Promise<Country[]> {
    const query = new URLSearchParams({ yesterday: options.yesterday.toString(), sort: options.sort ?? "" });
    return new Promise((done) => {
      this.request(`/countries?${query}`)
        .then((res) => done(res.json()))
        .catch((err) => this.logger.error(err));
    });
  }

  private request(endpoint: string, options?: RequestInit) {
    return fetch(`${this.BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...(options ?? {}).headers,
        "User-Agent": "Kyflx Discord Bot (NodeJS, v3.0.0)",
        "Content-Type": "application/json",
      },
    });
  }
}

export interface AllStatistics {
  updated: number;
  cases: number;
  todayCases: number;
  deaths: number;
  todayDeaths: number;
  recovered: number;
  active: number;
  critical: number;
  casesPerOneMillion: number;
  deathsPerOneMillion: number;
  tests: number;
  testsPerOneMillion: number;
  affectedCountries: number;
}

export interface Country {
  updated: number;
  country: string;
  countryInfo: CountryInfo;
  cases: number;
  todayCases: number;
  deaths: number;
  todayDeaths: number;
  recovered: number;
  active: number;
  critical: number;
  casesPerOneMillion: number;
  deathsPerOneMillion: number;
  tests: number;
  testsPerOneMillion: number;
  continent: string;
}

export interface CountryInfo {
  _id: number;
  iso2: string;
  iso3: string;
  lat: number;
  long: number;
  flag: string;
}
