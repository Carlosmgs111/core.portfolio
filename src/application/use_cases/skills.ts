import { Skill } from "../../domain/entities/Skill";
import { RepositoryService } from "../../config/dependencies";
// ! implementar el uso de ´boom´ a traves de un ´interface´
import boom from "@hapi/boom";

export const getAllSkills = async (data: any) => {
  return await RepositoryService.findAll(RepositoryService.entities.Skill);
};

export const addNewSkill = async (data: any) => {
  return await Skill.create(RepositoryService, data);
};

export const deleteSkill = async (data: any) =>
  await (await Skill.load(RepositoryService, data)).remove(RepositoryService);

export const updateSkill = async (data: any) =>
  await (
    await Skill.load(RepositoryService, { uuid: data.uuid })
  ).update(RepositoryService, data);
