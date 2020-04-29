import { Document } from "mongoose";
export interface INote extends Document {
  noteData: string;
}
