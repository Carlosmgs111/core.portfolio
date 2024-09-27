import { RepositoryService } from "../../../../config/dependencies";
import { model, Schema, Document } from "mongoose";

interface ICertification extends Document {
  uuid: string;
  title: string;
  Users: Array<any>;
  Institution: string;
  // institutionUUID: string;
  emitedDate: number;
  image: string;
  url: string;
  tags: String[];
  emitedAt: number;
  createdAt: number;
  updatedAt: number;
}

const certificationSchema = new Schema<ICertification>({
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

const Certification = model<ICertification>(
  "Certification",
  certificationSchema
);

RepositoryService.QueryService.addModel("Certification", Certification);
