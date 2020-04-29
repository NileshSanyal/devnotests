import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User, validateUser } from "./user.schema";
import jwt, { Secret } from "jsonwebtoken";
import dotenv from "dotenv";

export class UserController {
  public async getAllUsers(req: Request, res: Response) {
    const users = [
      { _id: "323sddsdsd", name: "Adam" },
      { _id: "323sddsds2", name: "Vyas" },
      { _id: "323sdds44d", name: "Sam" }
    ];
    try {
      if (users.length > 0) {
        return res.status(200).json({ error: false, data: users });
      } else {
        return res
          .status(200)
          .json({ error: false, message: "No users found!" });
      }
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: "Some unknown error occurred! Please try again later"
      });
    }
  }
  public async createUser(req: Request, res: Response) {
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
              .status(200)
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
  }

  public async loginUser(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      dotenv.config();
      const passportSecretKey: Secret = process.env.PASSPORT_SECRET_KEY;

      // const { error } = validateUser(req.body);

      if (
        (!email && !password) ||
        (!email && password) ||
        (email && !password)
      ) {
        return res
          .status(400)
          .json({ error: true, messages: "Please enter email and password" });
      } else {
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
          } else {
            const user = await User.findOne({ email });

            if (!user) {
              return res
                .status(200)
                .json({ error: true, message: "User does not exist" });
            } else {
              const userid = user._id;
              const match = await bcrypt.compare(password, user.password);
              if (!match) {
                return res.status(400).json({
                  error: true,
                  message: "The password is invalid"
                });
              } else {
                const token = jwt.sign({ email }, passportSecretKey, {
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
    } catch (error) {
      return res.status(500).json({
        error: true,
        message:
          "Some unknown error occurred! Please try again later" +
          error.toString()
      });
    }
  }
}

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
