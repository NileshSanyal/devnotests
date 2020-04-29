"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bodyParser = __importStar(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const passport_1 = __importDefault(require("passport"));
const passport_2 = require("../config/passport");
const base_routes_1 = __importDefault(require("./routes/base-routes"));
class CoreModule {
    constructor() {
        this.app = express_1.default();
        this.configExpress();
        this.routes();
    }
    get express() {
        return this.app;
    }
    configExpress() {
        this.express.use(cors_1.default());
        passport_2.applyPassportStrategy(passport_1.default);
        this.express.use(bodyParser.urlencoded({ extended: true }));
        this.express.use(bodyParser.json());
    }
    routes() {
        this.app.use("/api/v1", base_routes_1.default);
    }
}
exports.CoreModule = CoreModule;
