import express, { Application } from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import passport from "passport";

import { applyPassportStrategy } from "../config/passport";
import routes from "./routes/base-routes";

export class CoreModule {
  private app: Application;

  constructor() {
    this.app = express();
    this.configExpress();
    this.routes();
  }

  public get express(): Application {
    return this.app;
  }

  private configExpress(): void {
    this.express.use(cors());
    applyPassportStrategy(passport);
    this.express.use(bodyParser.urlencoded({ extended: true }));
    this.express.use(bodyParser.json());
  }

  private routes(): void {
    this.app.use("/api/v1", routes);
  }
}
