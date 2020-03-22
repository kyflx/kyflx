import { Permissions } from "discord.js";
import { Request, Response } from "express";
import passport from "passport";
import { Strategy } from "passport-discord";
import { APIRouter, Get, Guild, Router } from "../../lib";

declare module "express" {
  interface Request {
    user: Strategy.Profile & {
      guilds: Array<Guild>;
    };
  }
}

@Router()
export default class MainRouter extends APIRouter {
  @Get("/servers")
  public async dashboard(req: Request, res: Response) {
    if (!req.isAuthenticated()) return res.redirect("/login");
    const guilds = req.user.guilds.reduce((acc, guild) => {
      const permissions = new Permissions(guild.permissions),
        _guild = this.client.guilds.resolve(guild.id);
      if (permissions.has("ADMINISTRATOR") || guild.owner)
        acc.push(
          {...guild,
            joined: !!_guild,
            _guild: _guild ? _guild.toJSON() : null}
        );
      return acc;
    }, []);

    res.status(200).json({
      invite: await this.client.generateInvite("ADMINISTRATOR"),
      guilds,
      user: req.user,
      isAuthenticated: req.isAuthenticated()
    });
  }

  @Get("/servers/:guild_id")
  public async guildDash(req: Request, res: Response) {
    if (!req.isAuthenticated()) return res.redirect("/login");

    const guild = this.client.guilds.resolve(req.params.guild_id);
    if (!guild)
      return res.status(404).json({ message: "Not Found", code: 404 });
    if (
      !guild.owner ||
      !guild.member(req.user.id).permissions.has("ADMINISTRATOR")
    )
      return res.status(401).json({ message: "Unauthorized", code: 401 });

    res.status(200).json({
      discord_guild: guild.toJSON(),
      database_guild: this.client.ensureGuild(guild.id),
      code: 200,
      isAuthenticated: true,
      user: req.user
    });
  }

  @Get("/user")
  public async getUser(req: Request, res: Response) {
    return res.status(200).json({
      user: req.user,
      code: 200,
      message: req.isAuthenticated() ? "authenticated" : "unauthenticated"
    });
  }

  @Get(
    "/login",
    passport.authenticate("discord", { scope: ["identify", "guilds"] })
  )
  public login(req: Request, res: Response) {
    return res.redirect("/servers");
  }

  @Get("/logout")
  public logout(req: Request, res: Response) {
    if (req.isAuthenticated()) req.logout();
    res.redirect("/");
  }

  @Get(
    "/callback",
    passport.authenticate("discord", { failureRedirect: "../" })
  )
  public callback(req: Request, res: Response) {
    return res.redirect("/servers");
  }
}
