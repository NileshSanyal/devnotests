import express, { Router, Request, Response } from "express";
import { UserController } from "./user.controller";

export const router = Router();

const userController = new UserController();

router.get("/list", userController.getAllUsers);

router.post("/register", userController.createUser);

router.post("/login", userController.loginUser);

// router.put("/update", updateUser);

// router.delete("/delete", deleteUser);
