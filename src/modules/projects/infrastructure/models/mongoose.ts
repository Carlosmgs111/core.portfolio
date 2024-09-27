import { RepositoryService } from "../../../../config/dependencies";
import { model, Schema, Document } from "mongoose";

export interface IProject extends Document {
  uuid: string;
  User: string;
  name: string;
  descriptions: [string];
  images: [string];
  tags: [string];
  stack: [string];
  state: string;
  kind: [string];
  Users: [string];
  uri: string;
  version: string;
  createdAt: number;
  updatedAt: number;
}

const projectSchema: any = new Schema<IProject>({
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
  descriptions: {
    type: [String],
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  tags: {
    type: [String],
    required: true,
  },
  stack: {
    type: [String],
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  kind: {
    type: [String],
    required: true,
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

export const Project = model<IProject>("Project", projectSchema);

RepositoryService.QueryService.addModel("Project", Project);
