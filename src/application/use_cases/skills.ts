import { Skill } from "../../domain/entities/Skill";
import { DatabaseService } from "../../config/dependencies";
// ! implementar el uso de ´boom´ a traves de un ´interface´
import boom from "@hapi/boom";

export const getAllSkills = async (data: any) => {
  return await DatabaseService.setupModel("Skill").findAll();
};

export const addNewSkill = async (data: any) => {
  return await Skill.create(DatabaseService, data);
};

export const deleteSkill = async (data: any) =>
  await (await Skill.load(DatabaseService, data)).remove(DatabaseService);

export const updateSkill = async (data: any) =>
  await (
    await Skill.load(DatabaseService, { uuid: data.uuid })
  ).update(DatabaseService, data);
