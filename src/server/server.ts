import { Application } from "express";
import http from "http";

import { CoreModule } from "../core/core";
import { Database } from "../core/database/db";
import { SettingsHelper } from "../config/settings-helper";

export class Server {
  private express: Application;
  private database: Database;

  constructor() {
    this.express = new CoreModule().express;
    this.database = new Database();
    const { serverPort } = SettingsHelper.getSettings();
    this.upServer(Number(serverPort));
  }

  private upServer(port: number) {
    http
      .createServer(this.express)
      .listen(port)
      .on("listening", this.onServerUp.bind(this, port))
      .on("error", this.onServerStartUpError.bind(this));
  }

  private onServerUp(port: number) {
    this.database.connect();
    console.log(`Server is running on port ${port}`);
  }

  private onServerStartUpError(error: Error) {
    this.database.closeConnection();
    console.log(`An error occurred: ${error}`);
  }
}
