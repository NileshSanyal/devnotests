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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_schema_1 = require("./user.schema");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
class UserController {
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = [
                { _id: "323sddsdsd", name: "Adam" },
                { _id: "323sddsds2", name: "Vyas" },
                { _id: "323sdds44d", name: "Sam" }
            ];
            try {
                if (users.length > 0) {
                    return res.status(200).json({ error: false, data: users });
                }
                else {
                    return res
                        .status(200)
                        .json({ error: false, message: "No users found!" });
                }
            }
            catch (error) {
                return res.status(500).json({
                    error: true,
                    message: "Some unknown error occurred! Please try again later"
                });
            }
        });
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userName, email, password } = req.body;
                const { error } = user_schema_1.validateUser(req.body);
                if (error) {
                    const errMessages = [];
                    const errArrayLength = error.details.length;
                    for (let i = 0; i < errArrayLength; i++) {
                        const errObj = {
                            errorcount: 0,
                            message: ""
                        };
                        errObj.errorcount = i + 1;
                        errObj.message = error.details[i].message;
                        errMessages.push(errObj);
                    }
                    return res.status(422).json({ error: true, messages: errMessages });
                }
                else {
                    if (userName && email && password) {
                        const isUserExist = yield user_schema_1.User.findOne({ email });
                        if (isUserExist) {
                            return res
                                .status(200)
                                .json({ error: true, message: "User already exists" });
                        }
                        else {
                            const user = new user_schema_1.User({ userName, email, password });
                            yield user.save();
                            return res
                                .status(200)
                                .json({ error: false, message: "User registered successfully" });
                        }
                    }
                }
            }
            catch (error) {
                return res.status(500).json({
                    error: true,
                    message: "Some unknown error occurred! Please try again later"
                });
            }
        });
    }
    loginUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                dotenv_1.default.config();
                const passportSecretKey = process.env.PASSPORT_SECRET_KEY;
                // const { error } = validateUser(req.body);
                if ((!email && !password) ||
                    (!email && password) ||
                    (email && !password)) {
                    return res
                        .status(400)
                        .json({ error: true, messages: "Please enter email and password" });
                }
                else {
                    if (email && password) {
                        // check for valid email
                        const emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
                        const isEmailValid = emailRegex.test(email);
                        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{5,15}$/;
                        const isPassValid = passwordRegex.test(password);
                        if (!isEmailValid) {
                            return res.status(400).json({
                                error: true,
                                message: "The email is invalid"
                            });
                        }
                        else {
                            const user = yield user_schema_1.User.findOne({ email });
                            if (!user) {
                                return res
                                    .status(200)
                                    .json({ error: true, message: "User does not exist" });
                            }
                            else {
                                const userid = user._id;
                                const match = yield bcryptjs_1.default.compare(password, user.password);
                                if (!match) {
                                    return res.status(400).json({
                                        error: true,
                                        message: "The password is invalid"
                                    });
                                }
                                else {
                                    const token = jsonwebtoken_1.default.sign({ email }, passportSecretKey, {
                                        expiresIn: 1000000
                                    });
                                    return res.status(200).json({
                                        error: false,
                                        token,
                                        userid
                                    });
                                }
                            }
                        }
                    }
                }
                /* if (error) {
                  const errMessages = [];
                  const errArrayLength = error.details.length;
                  for (let i = 0; i < errArrayLength; i++) {
                    const errObj: { errorcount: number; message: string } = {
                      errorcount: 0,
                      message: ""
                    };
                    errObj.errorcount = i + 1;
                    errObj.message = error.details[i].message;
                    errMessages.push(errObj);
                  }
                  return res.status(422).json({ error: true, messages: errMessages });
                } */
                // else {
                // }
            }
            catch (error) {
                return res.status(500).json({
                    error: true,
                    message: "Some unknown error occurred! Please try again later" +
                        error.toString()
                });
            }
        });
    }
}
exports.UserController = UserController;
/* export const getAllUsers: express.RequestHandler = async (
  req: Request,
  res: Response
) => {
  const users = [
    { _id: "323sddsdsd", name: "Adam" },
    { _id: "323sddsds2", name: "Vyas" },
    { _id: "323sdds44d", name: "Sam" }
  ];
  try {
    if (users.length > 0) {
      return res.status(200).json({ error: false, data: users });
    } else {
      return res.status(200).json({ error: false, message: "No users found!" });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Some unknown error occurred! Please try again later"
    });
  }
};

export const createUser: express.RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { userName, email, password } = req.body;

    const { error } = validateUser(req.body);

    if (error) {
      const errMessages = [];
      const errArrayLength = error.details.length;
      for (let i = 0; i < errArrayLength; i++) {
        const errObj: { errorcount: number; message: string } = {
          errorcount: 0,
          message: ""
        };
        errObj.errorcount = i + 1;
        errObj.message = error.details[i].message;
        errMessages.push(errObj);
      }
      return res.status(422).json({ error: true, messages: errMessages });
    } else {
      if (userName && email && password) {
        const isUserExist = await User.findOne({ email });
        if (isUserExist) {
          return res
            .status(303)
            .json({ error: true, message: "User already exists" });
        } else {
          const user = new User({ userName, email, password });
          await user.save();

          return res
            .status(200)
            .json({ error: false, message: "User registered successfully" });
        }
      }
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Some unknown error occurred! Please try again later"
    });
  }
};

export const loginUser: express.RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    dotenv.config();
    const passportSecretKey: Secret = process.env.PASSPORT_SECRET_KEY;
    const { error } = validateUser(req.body);

    if (error) {
      const errMessages = [];
      const errArrayLength = error.details.length;
      for (let i = 0; i < errArrayLength; i++) {
        const errObj: { errorcount: number; message: string } = {
          errorcount: 0,
          message: ""
        };
        errObj.errorcount = i + 1;
        errObj.message = error.details[i].message;
        errMessages.push(errObj);
      }
      return res.status(422).json({ error: true, messages: errMessages });
    } else {
      if (email && password) {
        const user = await User.findOne({ email });
        if (!user) {
          return res
            .status(400)
            .json({ error: true, message: "User does not exist" });
        } else {
          const match = await bcrypt.compare(password, user.password);
          if (!match) {
            return res
              .status(400)
              .json({ error: true, message: "The password is invalid" });
          } else {
            const token = jwt.sign({ email }, passportSecretKey, {
              expiresIn: 1000000
            });
            return res.status(200).json({
              error: false,
              token
            });
          }
        }
      }
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message:
        "Some unknown error occurred! Please try again later" + error.toString()
    });
  }
}; */
