import { RepositoryService } from "../../../../config/dependencies";

RepositoryService.QueryService.addModel("Institution", {
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
  businessName: {
    type: String,
    unique: false,
    required: true,
    trim: true,
  },
  Users: [{ type: String, ref: "User" }],
  Certifications: [{ type: String, ref: "Certification" }],
  descriptions: {
    type: [String],
    unique: false,
    required: true,
    lowercase: true,
    trim: true,
    default: [],
  },
  urls: {
    type: [String],
    required: false,
    unique: false,
    default: [],
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
