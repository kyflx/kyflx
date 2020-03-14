import { Request, Response } from "express";
import { APIRouter, Get, Router } from "../../lib";

@Router("/api")
export default class V1Router extends APIRouter {
  @Get()
  public getV1(_: Request, res: Response) {
    return res.status(200).json({
      message: "Welcome to the VorteKore API",
      versions: ["v1 /api/v1"]
    });
  }
}
