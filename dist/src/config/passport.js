"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_jwt_1 = require("passport-jwt");
const dotenv_1 = __importDefault(require("dotenv"));
const user_schema_1 = require("../modules/user/user.schema");
exports.applyPassportStrategy = (passport) => {
    dotenv_1.default.config();
    const options = {
        jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: String(process.env.PASSPORT_SECRET_KEY)
    };
    passport.use(new passport_jwt_1.Strategy(options, (payload, done) => {
        user_schema_1.User.findOne({ email: payload.email }, (err, user) => {
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, {
                    email: user.email,
                    _id: user["_id"]
                });
            }
            return done(null, false);
        });
    }));
};
