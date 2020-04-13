import { MessageEmbed } from "discord.js";
import { Request, Response } from "express";
import { logs, stats } from "../../..";
import { APIRouter, Config, Get, Post, Router } from "../../../lib";

@Router("/api/v1")
export default class V1Router extends APIRouter {
  @Get()
  public getV1(_: Request, res: Response) {
    return res.status(200).json({
      message: "Version 1 API",
      endpoints: [
        "GET /[top.gg|dbl]",
        "GET /stats",
        "POST /voted (DBL)",
        "GET /invite",
        "GET /[discord|server|"
      ]
    });
  }

  @Get("/top.gg")
  @Get("/dbl")
  public getDBL(req: Request, res: Response) {
    return res.status(200).json({
      url: "https://top.gg/bot/634766962378932224/"
    });
  }

  @Get("/discord")
  @Get("/server")
  public getServer(_: Request, res: Response) {
    return res.status(200).json({
      invite: "https://discord.gg/8nqD2Qa"
    });
  }

  @Get("/invite")
  public async getInvite(_: Request, res: Response) {
    return res.status(200).json({
      invite: await this.client.generateInvite(["ADMINISTRATOR"])
    });
  }

  @Get("/stats")
  public getStats(req: Request, res: Response) {
    return res.status(200).json({
      prometheus: stats.register.getMetricsAsJSON(),
      guilds: this.client.guilds.cache.size,
      users: this.client.users.cache.size,
      listeners: this.client.events.modules.size,
      commands: this.client.commands.modules.filter(
        m => m.categoryID !== "flag"
      ).size
    });
  }

  @Post("/voted")
  public async dblVote(req: Request, res: Response) {
    if (req.headers.authorization !== Config.get("bot_lists.dbl_webhook"))
      return res.status(400);
    if (req.body.type === "test") {
      return this.client.logger.info("DBL Test Success!");
    }

    const user = this.client.users.resolve(req.body.user);
    const embed = new MessageEmbed()
      .setColor("BLURPLE")
      .setTitle("top.gg vote")
      .setDescription(
        `${
          user ? `**${user}** \`(${req.body.user})\`` : req.body.user
        } voted for Kyflx on [top.gg](https://top.gg/bot/634766962378932224/)!`
      )
      .setFooter("VorteKore")
      .setTimestamp(new Date());

    await logs.send(embed);
    return res.status(200);
  }

  @Post("/botls")
  public async botlistSpaceVote(req: Request, res: Response) {
    if (req.headers.authorization === Config.get("bot_lists.botlist-space")) {
      const embed = new MessageEmbed()
        .setColor("BLURPLE")
        .setTitle("botlist.space vote")
        .setDescription(
          `<@${req.body.user.id}> \`(${req.body.user.id})\` voted for Kyflx on [botlist.space](https://botlist.space/bot/634766962378932224/)!`
        )
        .setFooter("VorteKore")
        .setTimestamp(req.body.timestamp);

      await logs.send(embed);
      return res.status(200);
    }
  }
}
