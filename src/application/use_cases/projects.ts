import { RepositoryService } from "../../config/dependencies";
import { Project } from "../../domain/entities/Project";
import { User } from "../../domain/entities/User";
import { filterAttrs } from "../../utils";
import { verifyToken2 } from "../../infrastructure/auth/JWT";

const formatProjects = (projects: [Project]) =>
  projects.map((project: any) =>
    filterAttrs(
      {
        ...project,
        buildedBy: project.Users.map(({ username }: any) => username),
      },
      ["Users"]
    )
  );

export const getProjects = async (data: any) => {
  const { username, user, size, page } = data;
  const projects = await Project.findAll(RepositoryService, {
    related: [["User", { attributes: ["username"] }]],
    size,
    page,
  });
  return formatProjects(projects);
};

export const getOwnProjects = async (data: any) => {
  const { token } = data;
  const { user } = await verifyToken2(token);
  return await User.projects(RepositoryService, user);
};

export const addProject = async (data: any) =>
  await Project.new(RepositoryService, data);

export const addManyProject = async (data: any) => {
  const { projects, user } = data;
  const newProjects: any = await Project.createMany(
    RepositoryService,
    projects.map((c: any) => ({ ...c, user }))
  );
  return newProjects.map((c: any) => ({
    ...c,
    grantedTo: user.username,
  }));
};

export const deleteProject = async (data: any) => {
  console.log({ data });
  await (
    await Project.load(RepositoryService, { credentials: { uuid: data.uuid } })
  ).remove(RepositoryService);
  return { message: "Project deleted", uuid: data.uuid };
};

export const updateProject = async (data: any) => {
  const { user, uuid } = data;
  await (
    await Project.load(RepositoryService, { credentials: { uuid } })
  ).update(RepositoryService, filterAttrs(data, ["uuid", "user", "token"]));

  return await Project.find(RepositoryService, {
    credentials: { uuid },
    related: [["User", { attributes: ["username"], as: "User" }]],
  });
};

// ! used only when the structure of a entity change and is necessary a reorder o modification of some attributes without change integrity of entity data
export const migrateDescriptionToDescriptions = async (data: any) => {
  const projects = await RepositoryService.findAll(
    RepositoryService.entities.Project
  );
  console.log({ projects });
  for (var project of projects) {
    const descriptions = project.description.split(". ");
    console.log({ descriptions });
    await updateProject({ uuid: project.uuid, descriptions, user: data.user });
  }
  return "OK!";
};

export const migrateRelationship2OneToN2N = async () => {
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
      console.log({ User, Users });
      /* await RepositoryService.CommandService.createOneRelationshipN2N([
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
