import { RepositoryService } from "../../../../config/dependencies";

RepositoryService.QueryService.addModel("User", {
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
    required: false,
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
  avatar: { type: String },
  Certifications: [{ type: String, ref: "Certification" }],
  Institutions: [{ type: String, ref: "Institution" }],
  Projects: [{ type: String, ref: "Project" }],
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
