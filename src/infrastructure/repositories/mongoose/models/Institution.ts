import { model, Schema, Document } from "mongoose";

export interface IInstitution extends Document {
  uuid: string;
  name: string;
  businessName: string;
  Users: Array<any>;
  descriptions: Array<string>;
  urls: Array<string>;
  createdAt: number;
  updatedAt: number;
}

const institutionSchema = new Schema<IInstitution>({
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
    lowercase: true,
    trim: true,
  },
  Users: [{ type: String, ref: "User" }],
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

export default model<IInstitution>("Institution", institutionSchema);
