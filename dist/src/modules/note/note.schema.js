"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Joi = __importStar(require("joi"));
const constants_1 = require("../../utils/constants");
const NoteSchema = new mongoose_1.Schema({
    noteData: {
        type: String,
        required: true
    },
    userid: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true
    }
});
exports.Note = mongoose_1.model("Note", NoteSchema);
function validateNote(noteObj) {
    const noteSchema = Joi.object().keys({
        noteid: Joi.string().error((errors) => {
            errors.forEach((err) => {
                switch (err.type) {
                    case "any.empty":
                        err.message = constants_1.EMPTY_NOTE_ID;
                        break;
                    default:
                        break;
                }
            });
            return errors;
        }),
        userid: Joi.string()
            .required()
            .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/)
            .error((errors) => {
            errors.forEach((err) => {
                switch (err.type) {
                    case "any.empty":
                        err.message = constants_1.EMPTY_NOTE_CREATE_USER_ID;
                        break;
                    case "string.regex.base":
                        err.message = constants_1.INVALID_USER_ID;
                        break;
                    default:
                        break;
                }
            });
            return errors;
        }),
        noteData: Joi.string()
            .required()
            .min(3)
            .max(100)
            .error((errors) => {
            errors.forEach((err) => {
                switch (err.type) {
                    case "any.empty":
                        err.message = constants_1.EMPTY_NOTE;
                        break;
                    case "string.min":
                        err.message = constants_1.MIN_NOTE_LENGTH;
                        break;
                    case "string.max":
                        err.message = constants_1.MAX_NOTE_LENGTH;
                        break;
                    default:
                        break;
                }
            });
            return errors;
        })
    });
    return Joi.validate(noteObj, noteSchema, { abortEarly: false });
}
exports.validateNote = validateNote;
