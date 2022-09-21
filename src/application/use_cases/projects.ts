import { DatabaseService } from "../../config/dependencies";
import { Project } from "../../domain/entities/Project";

export const getAllProjects = async () =>
  await DatabaseService.findAll();

export const addProject = async (data: any) =>
  await Project.new(DatabaseService, data);

export const deleteProject = async (data: any) =>
  await (
    await Project.load(DatabaseService, data)
  ).remove(DatabaseService);
