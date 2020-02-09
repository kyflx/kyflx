import express from "express";
import WebServer from "../server";
import { AkairoClient } from 'discord-akairo';

/**
 * Acts as a Rest Route.
 */
export class APIRouter {
  public server!: WebServer;
  public router: express.Router = express.Router();
  public constructor(public client: AkairoClient) {}
}
