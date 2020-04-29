import express, { Request, Response } from "express";
import { Document } from "mongoose";
import { Note, validateNote } from "./note.schema";
import { User } from "../user/user.schema";

export const getAllNotes: express.RequestHandler = async (
  req: Request,
  res: Response
) => {
  let notes: Document[] = [];
  try {
    const userId = req.body.userid;
    notes = await Note.find({ userid: userId }, "-__v -userid");
    if (notes.length > 0) {
      return res.status(200).json({ error: false, data: notes });
    } else {
      return res.status(200).json({ error: false, message: "No notes found!" });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Some unknown error occurred! Please try again later"
    });
  }
};

export const createNote: express.RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { userid, noteData } = req.body;

    const { error } = validateNote(req.body);

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
      // check if userid exists in user collection, if exists then continue, otherwise stop
      const isUserExist = await User.findOne({ _id: userid });
      if (isUserExist) {
        const note = new Note({ userid, noteData });
        const noteslist = [];
        const noteObj = await note.save();
        noteslist.push(noteObj._id);
        const user = await User.findById(userid);
        user?.notes?.push(noteslist);
        const isSuccess = await user?.save();
        if (isSuccess) {
          return res
            .status(200)
            .json({ error: false, message: "Note created successfully" });
        }
      } else {
        return res.status(400).json({
          error: true,
          message: "Unable to create note without a user!"
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Some unknown error occurred! Please try again later"
    });
  }
};

export const editNote: express.RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const noteId = req.params.noteId;

    if (noteId) {
      const note = await Note.findById(noteId, "-__v -_id");
      if (note) {
        return res.status(200).json({ error: false, data: note });
      } else {
        return res
          .status(404)
          .json({ error: false, message: "Note not found!" });
      }
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Some unknown error occurred! Please try again later"
    });
  }
};

export const updateNote: express.RequestHandler = async (
  req: Request,
  res: Response
) => {
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

    if (
      (!noteid && !noteData) ||
      (!noteid && noteData) ||
      (noteid && !noteData)
    ) {
      return res.status(400).json({
        error: true,
        messages: "Please enter note body alongwith note id"
      });
    } else {
      if (noteid && noteData) {
        const isSuccess = await Note.findByIdAndUpdate(noteid, {
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
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Some unknown error occurred! Please try again later"
    });
  }
};

export const deleteNote: express.RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const noteId = req.params.noteId;
    const userId = req.body.userid;
    const note = await Note.findById(noteId, "-__v -_id");
    if (note) {
      const noteWrittenByUserFound = await Note.findOne({ userid: userId });

      if (noteWrittenByUserFound) {
        const user = await User.findById(userId);
        // remove noteid from the notes array in users collection
        if (user) {
          user.notes?.pull({ _id: noteId });
          const userObj = await user.save();
          if (userObj) {
            const noteDeleted = await Note.deleteOne({ _id: noteId });
            if (noteDeleted) {
              return res
                .status(200)
                .json({ error: false, message: "Note deleted successfully!" });
            }
          }
        }
      }
    } else {
      return res.status(404).json({ error: false, message: "Note not found!" });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Some unknown error occurred! Please try again later"
    });
  }
};
