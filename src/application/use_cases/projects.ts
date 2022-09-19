import { DatabaseService } from "../../config/dependencies";
import { Project } from "../../domain/entities/Project";

export const getAllProjects = async () =>
  await DatabaseService.setupModel("Project").findAll();

export const addProject = async (data: any) =>
  await Project.new(DatabaseService.setupModel("Project"), data);

export const deleteProject = async (data: any) =>
  await (
    await Project.load(DatabaseService.setupModel("Project"), data)
  ).remove(DatabaseService.setupModel("Project"));
