import { DatabaseService } from "../../config/dependencies";
import { Project } from "../../domain/entities/Project";

export const getAllProjects = async () => await DatabaseService.setupModel("Project").findAll();

export const addProject = async (data: any) =>
  await Project.new(DatabaseService, data);

export const deleteProject = async (data: any) =>
  await (await Project.load(DatabaseService, data)).remove(DatabaseService);

export const updateProject = async (data: any) =>
  await (
    await Project.load(DatabaseService, {uuid: data.uuid})
  ).update(DatabaseService, data);

// ! used only when the structure of a entity change and is necessary a reorder o modification of some attributes without change integrity of entity data
export const migrateDescriptionToDescriptions = async(data:any)=>{
  const projects = await DatabaseService.setupModel("Project").findAll()
  console.log({projects});
  for(var project of projects){
    const descriptions = project.description.split(". ");
    console.log({descriptions})
    await updateProject({uuid:project.uuid, descriptions, user:data.user})
  }
  return "OK!"
}