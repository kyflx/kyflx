import { Logger } from "@ayana/logger";
import bodyParser from "body-parser";
import MongoStore from "connect-mongo";
import { AkairoClient, AkairoHandler } from "discord-akairo";
import express, { Request, Response, NextFunction } from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as DiscordStrategy } from "passport-discord";
import { join } from "path";
import { getRouteObject, Route } from "./lib";

export default class WebServer {
  public app: express.Application = express();
  public modules: Route[] = [];

  public constructor(public client: AkairoClient) {}

  public async init(): Promise<void> {
    this.app.use(
      express.static(join(process.cwd(), "public"), { maxAge: 86400000 })
    );

    this.app.use(bodyParser.json({ limit: "5mb" }));
    this.app.use(
      bodyParser.urlencoded({
        extended: true,
        parameterLimit: 10000,
        limit: "5mb"
      })
    );

    this.app.set("view engine", "ejs");

    this.app.use(
      session({
        store: new (MongoStore(session))({
          url: this.client.config.get("URI"),
          secret: process.env.API_SESSION_SECRET
        }),
        secret: process.env.API_SESSION_SECRET!,
        resave: false,
        saveUninitialized: false
      })
    );

    passport.use(
      new DiscordStrategy(
        {
          callbackURL: "/callback",
          clientID: this.client.user.id,
          clientSecret: process.env.CLIENT_SECRET!,
          scope: ["identify", "guilds"]
        },
        async (accessToken, refreshToken, profile, done) => {
          return done(null, profile);
        }
      )
    );

    passport.serializeUser((user: any, done) => {
      delete user.email;
      done(null, user);
    });
    passport.deserializeUser((id, done) => {
      done(null, id);
    });

    this.app.use(passport.initialize());
    this.app.use(passport.session());

    await this.loadAll();

    this.app.listen(3000);
    WebServer.logger.info("Listening on Port 3000");
  }

  public async loadAll(): Promise<void> {
    for (const path of AkairoHandler.readdirRecursive(
      join(__dirname, "routes")
    )) {
      const routeMod: typeof Route = (_ => _.default || _)(require(path)),
        routeInstance = new routeMod(this.client);

      const router = getRouteObject(routeInstance);
      if (!router) return;

      for (const route of router.routes)
        (<Function> routeInstance.router[route.method].apply)(
          routeInstance.router,
          [
            route.path,
            ...route.handlers,
            async (req: Request, res: Response, next: NextFunction) => {
              try {
                await route.fn.apply(routeInstance, [req, res, next]);
              } catch (error) {
                WebServer.logger.error(error);
                res
                  .status(500)
                  .json({
                    code: 500,
                    message: "Sorry, something went wrong."
                  })
                  .end();
              }
            }
          ]
        );

      this.modules.push(Object.assign(routeInstance, { routeObject: router }));
      this.app.use(router.name, routeInstance.router);
    }
  }

  public static logger: Logger = Logger.get(WebServer);
}
