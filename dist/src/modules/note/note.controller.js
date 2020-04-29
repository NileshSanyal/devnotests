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
Object.defineProperty(exports, "__esModule", { value: true });
const note_schema_1 = require("./note.schema");
const user_schema_1 = require("../user/user.schema");
exports.getAllNotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let notes = [];
    try {
        const userId = req.body.userid;
        notes = yield note_schema_1.Note.find({ userid: userId }, "-__v -userid");
        if (notes.length > 0) {
            return res.status(200).json({ error: false, data: notes });
        }
        else {
            return res.status(200).json({ error: false, message: "No notes found!" });
        }
    }
    catch (error) {
        return res.status(500).json({
            error: true,
            message: "Some unknown error occurred! Please try again later"
        });
    }
});
exports.createNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { userid, noteData } = req.body;
        const { error } = note_schema_1.validateNote(req.body);
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
            // check if userid exists in user collection, if exists then continue, otherwise stop
            const isUserExist = yield user_schema_1.User.findOne({ _id: userid });
            if (isUserExist) {
                const note = new note_schema_1.Note({ userid, noteData });
                const noteslist = [];
                const noteObj = yield note.save();
                noteslist.push(noteObj._id);
                const user = yield user_schema_1.User.findById(userid);
                (_a = user === null || user === void 0 ? void 0 : user.notes) === null || _a === void 0 ? void 0 : _a.push(noteslist);
                const isSuccess = yield (user === null || user === void 0 ? void 0 : user.save());
                if (isSuccess) {
                    return res
                        .status(200)
                        .json({ error: false, message: "Note created successfully" });
                }
            }
            else {
                return res.status(400).json({
                    error: true,
                    message: "Unable to create note without a user!"
                });
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
exports.editNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const noteId = req.params.noteId;
        if (noteId) {
            const note = yield note_schema_1.Note.findById(noteId, "-__v -_id");
            if (note) {
                return res.status(200).json({ error: false, data: note });
            }
            else {
                return res
                    .status(404)
                    .json({ error: false, message: "Note not found!" });
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
exports.updateNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { noteid, noteData } = req.body;
        // const { error } = validateNote(req.body);
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
        }  */
        // else {
        if ((!noteid && !noteData) ||
            (!noteid && noteData) ||
            (noteid && !noteData)) {
            return res.status(400).json({
                error: true,
                messages: "Please enter note body alongwith note id"
            });
        }
        else {
            if (noteid && noteData) {
                const isSuccess = yield note_schema_1.Note.findByIdAndUpdate(noteid, {
                    noteData
                });
                if (isSuccess) {
                    return res
                        .status(200)
                        .json({ error: false, message: "Note updated successfully" });
                }
            }
        }
        // }
    }
    catch (error) {
        return res.status(500).json({
            error: true,
            message: "Some unknown error occurred! Please try again later"
        });
    }
});
exports.deleteNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const noteId = req.params.noteId;
        const userId = req.body.userid;
        const note = yield note_schema_1.Note.findById(noteId, "-__v -_id");
        if (note) {
            const noteWrittenByUserFound = yield note_schema_1.Note.findOne({ userid: userId });
            if (noteWrittenByUserFound) {
                const user = yield user_schema_1.User.findById(userId);
                // remove noteid from the notes array in users collection
                if (user) {
                    (_b = user.notes) === null || _b === void 0 ? void 0 : _b.pull({ _id: noteId });
                    const userObj = yield user.save();
                    if (userObj) {
                        const noteDeleted = yield note_schema_1.Note.deleteOne({ _id: noteId });
                        if (noteDeleted) {
                            return res
                                .status(200)
                                .json({ error: false, message: "Note deleted successfully!" });
                        }
                    }
                }
            }
        }
        else {
            return res.status(404).json({ error: false, message: "Note not found!" });
        }
    }
    catch (error) {
        return res.status(500).json({
            error: true,
            message: "Some unknown error occurred! Please try again later"
        });
    }
});
