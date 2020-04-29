import { Document } from "mongoose";
import { INote } from "./note";
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  notes?: [INote["_id"]];
}
