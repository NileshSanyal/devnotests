import { Schema, model } from "mongoose";
import * as Joi from "joi";
import bcrypt from "bcryptjs";
import {
  EMPTY_USERNAME,
  MIN_USERNAME_LENGTH,
  MAX_USERNAME_LENGTH,
  EMPTY_EMAIL,
  INVALID_EMAIL,
  EMPTY_PASSWORD,
  INVALID_PASSWORD
} from "../../utils/constants";

import { IUser } from "../../../types/user";

const UserSchema: Schema = new Schema({
  userName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  notes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Note"
    }
  ]
});

UserSchema.pre("save", async function (this: any, next: any) {
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export const User = model<IUser>("User", UserSchema);

export function validateUser(userObj: any) {
  const userSchema = Joi.object().keys({
    userName: Joi.string()
      .required()
      .min(3)
      .max(100)
      .error((errors) => {
        errors.forEach((err) => {
          switch (err.type) {
            case "any.empty":
              err.message = EMPTY_USERNAME;
              break;
            case "string.min":
              err.message = MIN_USERNAME_LENGTH;
              break;
            case "string.max":
              err.message = MAX_USERNAME_LENGTH;
              break;
            default:
              break;
          }
        });
        return errors;
      }),

    email: Joi.string()
      .required()
      .regex(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)
      .error((errors) => {
        errors.forEach((err) => {
          switch (err.type) {
            case "any.empty":
              err.message = EMPTY_EMAIL;
              break;
            case "string.regex.base":
              err.message = INVALID_EMAIL;
              break;
            default:
              break;
          }
        });
        return errors;
      }),

    password: Joi.string()
      .required()
      .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{5,15}$/)
      .error((errors) => {
        errors.forEach((err) => {
          switch (err.type) {
            case "any.empty":
              err.message = EMPTY_PASSWORD;
              break;
            case "string.regex.base":
              err.message = INVALID_PASSWORD;
              break;
            default:
              break;
          }
        });
        return errors;
      })
  });

  return Joi.validate(userObj, userSchema, { abortEarly: false });
}
