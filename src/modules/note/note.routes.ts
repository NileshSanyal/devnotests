import express, { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import passport from "passport";

import {
  getAllNotes,
  createNote,
  editNote,
  updateNote,
  deleteNote
} from "./note.controller";

export const router = Router();

router.post(
  "/list",
  passport.authenticate("jwt", { session: false }),
  getAllNotes
);

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  createNote
);

router.get(
  "/edit/:noteId",
  passport.authenticate("jwt", { session: false }),
  editNote
);

router.post(
  "/update",
  passport.authenticate("jwt", { session: false }),
  updateNote
);

router.post(
  "/delete/:noteId",
  passport.authenticate("jwt", { session: false }),
  deleteNote
);
