"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
class SettingsHelper {
    static getSettings() {
        dotenv_1.default.config();
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
exports.SettingsHelper = SettingsHelper;
