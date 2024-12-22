import { RepositoryService } from "../../../../config/dependencies";

RepositoryService.QueryService.addModel("Certification", {
  uuid: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    unique: true,
    required: true,
    lowercase: false,
    trim: false,
  },
  Users: [{ type: String, ref: "User" }],
  Institution: { type: String, ref: "Institution" },
  image: {
    type: String,
    required: true,
    unique: true,
  },
  url: {
    type: String,
    required: true,
    unique: true,
  },
  tags: { type: [String] },
  emitedAt: { type: Number }, 
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
