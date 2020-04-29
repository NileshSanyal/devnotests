"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Joi = __importStar(require("joi"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const constants_1 = require("../../utils/constants");
const UserSchema = new mongoose_1.Schema({
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
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Note"
        }
    ]
});
UserSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const salt = yield bcryptjs_1.default.genSalt(12);
        this.password = yield bcryptjs_1.default.hash(this.password, salt);
        next();
    });
});
exports.User = mongoose_1.model("User", UserSchema);
function validateUser(userObj) {
    const userSchema = Joi.object().keys({
        userName: Joi.string()
            .required()
            .min(3)
            .max(100)
            .error((errors) => {
            errors.forEach((err) => {
                switch (err.type) {
                    case "any.empty":
                        err.message = constants_1.EMPTY_USERNAME;
                        break;
                    case "string.min":
                        err.message = constants_1.MIN_USERNAME_LENGTH;
                        break;
                    case "string.max":
                        err.message = constants_1.MAX_USERNAME_LENGTH;
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
                        err.message = constants_1.EMPTY_EMAIL;
                        break;
                    case "string.regex.base":
                        err.message = constants_1.INVALID_EMAIL;
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
                        err.message = constants_1.EMPTY_PASSWORD;
                        break;
                    case "string.regex.base":
                        err.message = constants_1.INVALID_PASSWORD;
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
exports.validateUser = validateUser;
