import { Post } from '../domain/Post'
import { RepositoryService } from '../../../config/dependencies'

export const addPost = async (data: any) => {
  return await Post.create(RepositoryService, data)
}

export const getAllPosts = async (data: any) =>
  await RepositoryService.findAll(RepositoryService.entities.Post)

export const removePost = async (data: any) =>
  await (await Post.load(RepositoryService, data)).remove(RepositoryService)

export const updatePost = async (data: any) =>
  (await Post.load(RepositoryService, data)).update(RepositoryService, data)
