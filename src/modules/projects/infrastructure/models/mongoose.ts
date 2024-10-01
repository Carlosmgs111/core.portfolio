import { RepositoryService } from "../../../../config/dependencies";

RepositoryService.QueryService.addModel("Project", {
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
