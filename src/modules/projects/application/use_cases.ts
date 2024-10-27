import { Project } from "../domain/entity";
import { User } from "../../users/domain/entity";
import { serializeProjects } from "./DTOs";
/*  */
import { fromEnumToArray } from "../../../utils";
import { kind, state, stack } from "../../../enums";
export const getProjects = async (RepositoryService: any, data: any) => {
  const { size, page } = data;
  const projects = await Project.findAll(RepositoryService, {
    related: [["User", { attributes: ["username"] }]],
    size,
    page,
  });
  return {
    projects: serializeProjects(projects),
    /*  */
    kind: fromEnumToArray(kind),
    state: fromEnumToArray(state),
    stack: fromEnumToArray(stack),
  };
};

export const getOwnProjects = async (RepositoryService: any, data: any) => {
  const { token, user } = data;
  return await User.projects(RepositoryService, user);
};

export const addProject = async (RepositoryService: any, data: any) =>
  await Project.new(RepositoryService, data);

export const addManyProject = async (RepositoryService: any, data: any) => {
  const { projects, user } = data;
  const newProjects: any = await Project.createMany(
    RepositoryService,
    projects.map((c: any) => ({ ...c, user }))
  );
  return serializeProjects(newProjects);
};

export const deleteProject = async (RepositoryService: any, data: any) => {
  await (
    await Project.load(RepositoryService, { indexation: { uuid: data.uuid } })
  ).remove(RepositoryService, { userUUID: data.user.uuid });
  return { message: "Project deleted", uuid: data.uuid };
};

export const updateProject = async (RepositoryService: any, data: any) => {
  const { user, uuid, token, ...rest } = data;
  const result = await (
    await Project.load(RepositoryService, { indexation: { uuid } })
  ).update(RepositoryService, rest);
  console.log({result})
  return { updated: result };
};

// ! used only when the structure of a entity change and is necessary a reorder o modification of some attributes without change integrity of entity data
export const migrateDescriptionToDescriptions = async (
  RepositoryService: any,
  data: any
) => {
  const projects = await RepositoryService.findAll(
    RepositoryService.entities.Project
  );
  ({ projects });
  for (var project of projects) {
    const descriptions = project.description.split(". ");
    ({ descriptions });
    await updateProject(RepositoryService, {
      uuid: project.uuid,
      descriptions,
      user: data.user,
    });
  }
  return "OK!";
};

export const migrateRelationship2OneToN2N = async (RepositoryService: any) => {
  const projects = await Project.findAll(RepositoryService, {
    related: [
      [
        "User",
        {
          as: "User",
          attributes: ["uuid"],
        },
      ],
    ],
  });
  for (let project of projects) {
    const { User, Users } = project;
    if (User && Users.length === 0) {
      ({ User, Users });
      /* await RepositoryService.CommandService.setOneRelationshipManyToMany([
        [{ project: { uuid: project.uuid } }, { user: { uuid: User.uuid } }],
      ]); */
      /*  await RepositoryService.QueryService.setOneRelationship2One(
        { user: { uuid: User.uuid } },
        [
          {
            project: { uuid: project.uuid },
          },
        ]
      ); */
    }
    /* await RepositoryService.QueryService.removeAttribute(
      RepositoryService.entities.Project,
      { User: "" }
    ); */
  }
};
