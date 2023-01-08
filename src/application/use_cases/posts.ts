import { Post } from '../../domain/entities/Post'
import { DatabaseService } from '../../config/dependencies'

export const addPost = async (data: any) => {
  return await Post.create(DatabaseService, data)
}

export const getAllPosts = async (data: any) =>
  await DatabaseService.query.setupEntity('Post').findAll()

export const removePost = async (data: any) =>
  await (await Post.load(DatabaseService, data)).remove(DatabaseService)

export const updatePost = async (data: any) =>
  (await Post.load(DatabaseService, data)).update(DatabaseService, data)
