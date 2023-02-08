import { model, Schema, Document } from "mongoose";

export interface ISKill extends Document {
  uuid: string;
  Users: [string];
  name: string;
  description: string;
  image: string;
  tags: [string];
  createdAt: number;
  updatedAt: number;
}

const skillSchema = new Schema<ISKill>({
  uuid: {
    type: String,
    required: true,
    unique: true,
  },
  Users: [{ type: String, ref: "User" }],
  name: {
    type: String,
    unique: true,
    required: true,
    lowercase: false,
    trim: false,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
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

export default model<ISKill>("Skill", skillSchema);
