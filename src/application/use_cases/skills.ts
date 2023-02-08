import { Skill } from "../../domain/entities/Skill";
import { RepositoryService } from "../../config/dependencies";
// ! implementar el uso de ´boom´ a traves de un ´interface´
import boom from "@hapi/boom";

export const getAllSkills = async (data: any) => {
  return await RepositoryService.findAll(RepositoryService.entities.Skill);
};

export const getSkillByUUID = async (data: any) => {
  return await Skill.find(RepositoryService, data);
};

export const addNewSkill = async (data: any) => {
  return await Skill.create(RepositoryService, data);
};
export const addManySkills = async (data: any) => {
  const { skills, user } = data;
  const newSkills = await Skill.createMany(
    RepositoryService,
    skills.map((c: any) => ({ ...c, user }))
  );
  return newSkills.map((c: any) => ({
    ...c,
    dominatedBy: user.username,
  }));
};

export const deleteSkill = async (data: any) => {
  await (
    await Skill.load(RepositoryService, data)
  ).remove(RepositoryService, { userUUID: data.user.uuid });
  return { message: "Skill deleted", uuid: data.uuid };
};

export const updateSkill = async (data: any) => {
  const { user, uuid } = data;
  await (
    await Skill.load(RepositoryService, { credentials: { uuid } })
  ).update(RepositoryService, data);
  return await getSkillByUUID({
    credentials: { uuid },
    related: [["User", { attributes: ["username"], as: "Users" }]],
  });
};
