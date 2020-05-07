import { APIWrapper, APIWrapperOptions } from "@kyflx-dev/util";
import fetch, { RequestInit } from "node-fetch";
import { Init } from "../../lib";
import { Commit, Organization, Repository, User } from "../../types";

@Init<APIWrapperOptions>({ url: "https://api.github.com" })
export default class GithubAPI extends APIWrapper {
  /**
   * Get an organizations or users repository list.
   * @param location - The organization or user name.
   */
  public repositories(location: string): Promise<Repository[]> {
    return new Promise((resolve) => {
      this.request(`/users/${location}/repos`)
        .then((res) => resolve(res.json()))
        .catch((err) => this.logger.error(err));
    });
  }

  /**
   * Get a github user.
   * @param name - The user's login name/username
   */
  public user(name: string): Promise<User> {
    return new Promise((resolve) => {
      this.request(`/users/${name}`)
        .then((res) => resolve(res.json()))
        .catch((err) => this.logger.error(err));
    });
  }

  /**
   * Gets a github organization.
   * @param name - The organization name.
   */
  public organization(name: string): Promise<Organization> {
    return new Promise((resolve) => {
      this.request(`/orgs/${name}`)
        .then((res) => resolve(res.json()))
        .catch((err) => this.logger.error(err));
    });
  }

  /**
   * Gets a github repository.
   * @param owner - The organization or user that owns the repository.
   * @param repo - The repository name.
   */
  public repository(owner: string, repo: string): Promise<Repository> {
    return new Promise((resolve) => {
      this.request(`/repos/${owner}/${repo}`)
        .then((res) => resolve(res.json()))
        .catch((err) => this.logger.error(err));
    });
  }

  /**
   * Gets the commits for a github repository.
   * @param owner - The organization or user that owns the repository.
   * @param repo - The repository name.
   */
  public commits(owner: string, repo: string): Promise<Commit[]> {
    return new Promise((resolve) => {
      this.request(`/repos/${owner}/${repo}/commits`)
        .then((res) => resolve(res.json()))
        .catch((err) => this.logger.error(err));
    });
  }

  public request(endpoint: string, init?: RequestInit) {
    return fetch(`${this.BASE_URL}${endpoint}`, {
      ...init,
      headers: {
        ...(init ?? {}).headers,
        "User-Agent": "Kyflx Discord Bot (NodeJS, v3.0.0)",
        "Content-Type": "application/json",
      },
    });
  }
}
