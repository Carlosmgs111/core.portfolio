import { model, Schema, Document } from 'mongoose'

export interface IProject extends Document {
  uuid: string
  User: string
  name: string
  descriptions: [string]
  images: [string]
  tags: [string]
  uri: string
  version: string
  createdAt: number
  updatedAt: number
}

const projectSchema = new Schema<IProject>({
  uuid: {
    type: String,
    required: true,
    unique: true,
  },
  User: { type: String, ref: 'User' },
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
})

export default model<IProject>('Project', projectSchema)
