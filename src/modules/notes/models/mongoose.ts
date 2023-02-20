import { model, Schema, Document } from "mongoose";

export interface INote extends Document {
  uuid: string;
  title: string;
  User: String;
  body: string;
  tags: String[];
  createdAt: number;
  updatedAt: number;
}

const noteSchema = new Schema<INote>({
  uuid: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    unique: false,
    required: true,
    lowercase: false,
    trim: false,
  },
  User: { type: String, ref: "User" },
  body: {
    type: String,
    required: true,
    unique: false,
  },
  tags: { type: [String] },
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

export default model<INote>("Note", noteSchema);
