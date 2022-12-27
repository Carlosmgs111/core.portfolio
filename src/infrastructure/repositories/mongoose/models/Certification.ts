import { model, Schema, Document } from "mongoose";

export interface ICertification extends Document {
  uuid: string;
  title: string;
  grantedTo: string;
  institutionUUID: string;
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
  grantedTo: { type: Schema.Types.String, ref: "User" },
  institutionUUID: {
    type: String,
    unique: false,
    required: true,
    lowercase: true,
    trim: true,
    ref: "Institution",
  },
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

export default model<ICertification>("Certification", certificationSchema);
