import { model, Schema, Document } from "mongoose";

export interface IUser extends Document {
  uuid: string;
  username: string;
  email: string;
  password: string;
  privilege: string;
  createdAt: number;
  updatedAt: number;
}

const userSchema = new Schema<IUser>({
  uuid: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
    lowercase: false,
    trim: false,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  privilege: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Number,
    required: true,
    modifiable: false,
  },
  updatedAt: {
    type: Number,
    required: true,
  },
});

export default model<IUser>("User", userSchema);
