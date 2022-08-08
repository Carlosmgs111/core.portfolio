import { model, Schema, Document } from "mongoose";

export interface IProject extends Document {
  uuid: string;
  name: string;
  description: string;
  uri: string;
  version: string;
  createdAt: number;
  updatedAt: number;
}

const projectSchema = new Schema<IProject>({
  uuid: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    unique: true,
    required: true,
    lowercase: false,
    trim: false,
  },
  description: {
    type: String,
    unique: true,
    required: true,
    lowercase: false,
    trim: false,
  },
  uri: {
    type: String,
    required: true,
  },
  version: {
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

export default model<IProject>("Project", projectSchema);
