"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_routes_1 = require("../../modules/user/user.routes");
const note_routes_1 = require("../../modules/note/note.routes");
const router = express_1.Router();
router.use("/users", user_routes_1.router);
router.use("/notes", note_routes_1.router);
exports.default = router;
