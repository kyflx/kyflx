import { Logger } from "@ayanaware/logger";
import bodyParser from "body-parser";
import { AkairoClient, AkairoHandler } from "discord-akairo";
import express, { NextFunction, Request, Response } from "express";
import { join } from "path";
import { APIRouter, getRouteObject } from "../lib";

export default class WebServer {
  public app: express.Application = express();
  public modules: Array<APIRouter> = [];
  public logger = Logger.get(WebServer);

  public constructor(public client: AkairoClient) {}

  public async init(): Promise<void> {
    this.app.use(
      express.static(join(process.cwd(), "public"), { maxAge: 86400000 })
    );

    // tslint:disable: deprecation

    this.app.use(bodyParser.json({ limit: "5mb" }));
    this.app.use(
      bodyParser.urlencoded({
        extended: true,
        parameterLimit: 10000,
        limit: "5mb"
      })
    );

    this.app.set("view engine", "ejs");

    // this.app.use(
    //   session({
    //     store: new (PgStore(session))({
    //       pool: new Pool({
    //         connectionString: Config.getEnv("uri"),

    //       })
    //     }),
    //     secret: Config.get("session_secret"),
    //     resave: false,
    //     saveUninitialized: false
    //   })
    // );

    // passport.use(
    //   new DiscordStrategy(
    //     {
    //       callbackURL: "/callback",
    //       clientID: this.client.user.id,
    //       clientSecret: Config.get<string>("client_secret"),
    //       scope: ["identify", "guilds"]
    //     },
    //     async (accessToken, refreshToken, profile, done) => {
    //       return done(null, profile);
    //     }
    //   )
    // );

    // passport.serializeUser((user: any, done) => {
    //   delete user.email;
    //   done(null, user);
    // });
    // passport.deserializeUser((id, done) => {
    //   done(null, id);
    // });

    // this.app.use(passport.initialize());
    // this.app.use(passport.session());

    await this.loadAll();

    this.app.listen(3000);
    this.logger.info("Listening on Port 3000");
  }

  public async loadAll(): Promise<void> {
    for (const path of AkairoHandler.readdirRecursive(
      join(__dirname, "routes")
    )) {
      // tslint:disable-next-line: tsr-detect-non-literal-require
      const routeMod: typeof APIRouter = (_ => _.default || _)(require(path)),
        routeInstance = new routeMod(this.client);

      const router = getRouteObject(routeInstance);
      if (!router) return;

      for (const route of router.routes)
        (routeInstance.router[route.method].apply as Function)(
          routeInstance.router,
          [
            route.path,
            ...route.handlers,
            async (req: Request, res: Response, next: NextFunction) => {
              try {
                await route.fn.apply(routeInstance, [req, res, next]);
              } catch (error) {
                this.logger.error(error);
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

      this.modules.push({ ...routeInstance });
      this.app.use(router.name, routeInstance.router);
    }
  }
}
