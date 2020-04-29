"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const core_1 = require("../core/core");
const db_1 = require("../core/database/db");
const settings_helper_1 = require("../config/settings-helper");
class Server {
    constructor() {
        this.express = new core_1.CoreModule().express;
        this.database = new db_1.Database();
        const { serverPort } = settings_helper_1.SettingsHelper.getSettings();
        this.upServer(Number(serverPort));
    }
    upServer(port) {
        http_1.default
            .createServer(this.express)
            .listen(port)
            .on("listening", this.onServerUp.bind(this, port))
            .on("error", this.onServerStartUpError.bind(this));
    }
    onServerUp(port) {
        this.database.connect();
        console.log(`Server is running on port ${port}`);
    }
    onServerStartUpError(error) {
        this.database.closeConnection();
        console.log(`An error occurred: ${error}`);
    }
}
exports.Server = Server;
