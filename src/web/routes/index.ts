import { Router, Get, Route, Use } from "../lib";
import { Request, Response } from "express";
import passport from "passport";
import { Profile } from "passport-discord";
import { Permissions } from "discord.js";

declare module "express" {
  interface Request {
    user: Profile;
  }
}

@Router()
export default class MainRouter extends Route {

  @Get()
  public home(req: Request, res: Response) {
    res.render("index", {
      isAuthenticated: req.isAuthenticated(),
      user: req.user,
      stats: {
        guilds: this.client.guilds.size,
        users: this.client.guilds.reduce(
          (prev, cur) => prev + cur.memberCount,
          0
        ),
        commands: this.client.commands.modules.size
      }
    });
  }

  @Get("/servers")
  public async dashboard(req: Request, res: Response) {
    if (!req.isAuthenticated()) return res.redirect("/login");
    const guilds = req.user.guilds.reduce((acc, guild) => {
      const permissions = new Permissions(guild.permissions);
      if (permissions.has("ADMINISTRATOR") || guild.owner)
        acc.push(
          Object.assign(guild, {
            joined: this.client.guilds.has(guild.id),
            _guild: this.client.guilds.get(guild.id)
          })
        );
      return acc;
    }, []);

    res.render("servers", {
      invite: await this.client.generateInvite("ADMINISTRATOR"),
      guilds,
      user: req.user,
      isAuthenticated: req.isAuthenticated()
    });
  }

  @Get("/servers/:guild_id")
  public async guildDash(req: Request, res: Response) {
    if (!req.isAuthenticated()) return res.redirect("/login");

    const guild = this.client.guilds.get(req.params.guild_id);
    if (!guild) return res.redirect("/servers");

    res.render("server", {
      guild, 
      isAuthenticated: true,
      user: req.user
    });
  }

  @Get("/servers/:guild_id/:endpoint")
  public async guildDashEndpoint(req: Request, res: Response) {
    if (!req.isAuthenticated()) return res.redirect("/login");

    const guild = this.client.guilds.get(req.params.guild_id);
    if (!guild) return res.redirect("/servers");

    res.render(req.params.endpoint, {
      guild, 
      isAuthenticated: true,
      user: req.user
    });
  }

  @Get(
    "/login",
    passport.authenticate("discord", { scope: ["identify", "guilds", "email"] })
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

  @Use()
  public notFound(req: Request, res: Response) {
    res.render("404", {
      isAuthenticated: req.isAuthenticated(),
      user: req.user,
      // path: req.path,
      // method: req.method,
      // methodColors: {
      //   get: "is-primary",
      //   post: "is-success",
      //   put: "is-discord",
      //   patch: "is-warning",
      //   delete: "is-danger"
      // }
    })
  }

}
