import { Settings } from "../../types/settings";
import dotenv from "dotenv";

export class SettingsHelper {
  public static getSettings(): Settings {
    dotenv.config();

    const NODE_ENV = String(process.env.NODE_ENV);
    const DB_NAME = String(process.env.DB_NAME);
    const PORT = String(process.env.PORT);
    const PROD_DB_URL = String(process.env.PROD_DB_URL);
    const LOCAL_DB_URL = String(process.env.LOCAL_DB_URL);

    const dbUrl = NODE_ENV !== "development" ? PROD_DB_URL : LOCAL_DB_URL;
    return {
      environment: NODE_ENV,
      database: DB_NAME,
      serverPort: PORT,
      dbUrl
    };
  }
}
