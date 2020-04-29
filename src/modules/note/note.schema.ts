import { Schema, model } from "mongoose";
import * as Joi from "joi";
import {
  EMPTY_NOTE,
  EMPTY_NOTE_ID,
  MIN_NOTE_LENGTH,
  MAX_NOTE_LENGTH,
  EMPTY_NOTE_CREATE_USER_ID,
  INVALID_USER_ID
} from "../../utils/constants";
import { INote } from "../../../types/note";
const NoteSchema: Schema = new Schema({
  noteData: {
    type: String,
    required: true
  },
  userid: {
    type: Schema.Types.ObjectId,
    required: true
  }
});

export const Note = model<INote>("Note", NoteSchema);

export function validateNote(noteObj: any) {
  const noteSchema = Joi.object().keys({
    noteid: Joi.string().error((errors) => {
      errors.forEach((err) => {
        switch (err.type) {
          case "any.empty":
            err.message = EMPTY_NOTE_ID;
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
              err.message = EMPTY_NOTE_CREATE_USER_ID;
              break;
            case "string.regex.base":
              err.message = INVALID_USER_ID;
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
              err.message = EMPTY_NOTE;
              break;
            case "string.min":
              err.message = MIN_NOTE_LENGTH;
              break;
            case "string.max":
              err.message = MAX_NOTE_LENGTH;
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
