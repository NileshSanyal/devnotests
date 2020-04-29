"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const note_controller_1 = require("./note.controller");
exports.router = express_1.Router();
exports.router.post("/list", passport_1.default.authenticate("jwt", { session: false }), note_controller_1.getAllNotes);
exports.router.post("/create", passport_1.default.authenticate("jwt", { session: false }), note_controller_1.createNote);
exports.router.get("/edit/:noteId", passport_1.default.authenticate("jwt", { session: false }), note_controller_1.editNote);
exports.router.post("/update", passport_1.default.authenticate("jwt", { session: false }), note_controller_1.updateNote);
exports.router.post("/delete/:noteId", passport_1.default.authenticate("jwt", { session: false }), note_controller_1.deleteNote);
