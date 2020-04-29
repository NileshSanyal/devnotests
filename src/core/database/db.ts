import mongoose from "mongoose";
import { SettingsHelper } from "../../config/settings-helper";

export class Database {
  public connect() {
    const { dbUrl, database } = SettingsHelper.getSettings();
    mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
    });
    mongoose.connection
      .on("connected", this.log.bind(this, `Mongoose connected to ${database}`))
      .on("error", this.log.bind(this, `Mongoose connection error:`))
      .on(
        "disconnected",
        this.log.bind(this, `Mongoose disconnected from ${database}`)
      );
  }

  public closeConnection() {
    mongoose.connection.close();
  }

  private log(message: string, additionalInfo?: any) {
    const msg =
      !!message && !!additionalInfo
        ? `${message} ${additionalInfo}`
        : `${message}`;
    console.log(msg);
  }
}
