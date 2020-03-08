import { Request, Response } from "express";
import { stats } from "../..";
import { APIRouter, Get, Router } from "../../lib";

@Router("/api/v1")
export default class V1Router extends APIRouter {
  @Get()
  public getV1(req: Request, res: Response) {
    return res.status(200).json({
      message: "VorteKore API v1"
    });
  }

  @Get("/stats")
  public getStats(req: Request, res: Response) {
    return res.status(200).json(stats.register.getMetricsAsJSON());
  }
}
