import { model, Schema, Document } from 'mongoose'

export interface IPost extends Document {
  uuid: string
  User: string
  title: string
  content: string
  createdAt: number
  updatedAt: number
}

const postSchema = new Schema<IPost>({
  uuid: {
    type: String,
    required: true,
    unique: true,
  },
  User: { type: String, ref: 'User' },
  title: {
    type: String,
    unique: true,
    required: true,
    lowercase: false,
    trim: false,
  },
  content: {
    type: String,
    unique: false,
    required: true,
    lowercase: true,
    trim: true,
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

export default model<IPost>('Post', postSchema)
