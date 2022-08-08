import { DatabaseService } from "../services/DatabaseServices.ts";
import { Project } from "../entities/Project";
import Institution from "../../infrastructure/repositories/mongoose/models/Institution";

const DBService = new DatabaseService({ __identifier: "Project" });

export const getAllProjects = async () => {
  return await DBService.find();
};

export const addProject = async (data: any) => {
  return await Project.new(DBService, data);
};
