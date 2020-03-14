import { MessageEmbed } from "discord.js";
import { Request, Response } from "express";
import { stats, logs } from "../..";
import { APIRouter, Get, Post, Router } from "../../lib";
import fetch from "node-fetch";

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

  @Post("/dbl")
  public async dblVote(req: Request, res: Response) {
    if (req.headers.authorization !== process.env.DBL_WEB)
      return res.status(400);
    if (req.body.type === "test") {
      return this.server.logger.info("DBL Test Success!");
    }

    const user = this.client.users.resolve(req.body.user);
    const embed = new MessageEmbed()
      .setColor("0c6dcf")
      .setDescription(
        `**${
          user ? `${user} \`(${req.body.user})\`` : req.body.user
        }** voted for VorteKore!`
      );
    embed.setAuthor.apply(
      embed,
      user ? [req.body.user] : [user.username, user.displayAvatarURL()]
    );

    logs.send(embed);
    return res.status(200);
  }
}
