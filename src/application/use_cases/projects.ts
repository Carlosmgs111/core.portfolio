import { DatabaseService } from "../services/DatabaseServices";
import { Project } from "../../domain/entities/Project";
import Institution from "../../infrastructure/repositories/mongoose/models/Institution";

const DBService = new DatabaseService({ __identifier: "Project" });

export const getAllProjects = async () => {
  return await DBService.findAll();
};

export const addProject = async (data: any) => {
  console.log({data})
  return await Project.new(DBService, data);
};
