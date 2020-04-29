import { Strategy, ExtractJwt, JwtFromRequestFunction } from "passport-jwt";
import dotenv from "dotenv";
import { User } from "../modules/user/user.schema";
import { PassportStatic } from "passport";

interface IPassportOption {
  jwtFromRequest: JwtFromRequestFunction;
  secretOrKey: string;
}

export const applyPassportStrategy = (passport: PassportStatic) => {
  dotenv.config();
  const options: IPassportOption = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: String(process.env.PASSPORT_SECRET_KEY)
  };

  passport.use(
    new Strategy(options, (payload, done) => {
      User.findOne({ email: payload.email }, (err, user) => {
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
    })
  );
};
