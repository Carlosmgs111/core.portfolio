import { RepositoryService } from "../../config/dependencies";
import { Project } from "../../domain/entities/Project";
import { User } from "../../domain/entities/User";
import { filterAttrs } from "../../utils";
import { verifyToken2 } from "../../infrastructure/auth/JWT";

const formatProjects = (projects: [Project]) =>
  projects.map((project: any) =>
    filterAttrs({ ...project, createdBy: project.User.username }, ["User"])
  );

export const getProjects = async (data: any) => {
  const { username, user, size, page } = data;
  const projects = await Project.findAll(RepositoryService, {
    related: [["User", { as: "User", credentials: username && { username } }]],
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
  ).update(RepositoryService, data);

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
