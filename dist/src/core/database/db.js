"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const settings_helper_1 = require("../../config/settings-helper");
class Database {
    connect() {
        const { dbUrl, database } = settings_helper_1.SettingsHelper.getSettings();
        mongoose_1.default.connect(dbUrl, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true
        });
        mongoose_1.default.connection
            .on("connected", this.log.bind(this, `Mongoose connected to ${database}`))
            .on("error", this.log.bind(this, `Mongoose connection error:`))
            .on("disconnected", this.log.bind(this, `Mongoose disconnected from ${database}`));
    }
    closeConnection() {
        mongoose_1.default.connection.close();
    }
    log(message, additionalInfo) {
        const msg = !!message && !!additionalInfo
            ? `${message} ${additionalInfo}`
            : `${message}`;
        console.log(msg);
    }
}
exports.Database = Database;
