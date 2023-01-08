import { DatabaseService } from "../../config/dependencies";
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
  const projects = await Project.findAll(DatabaseService, {
    related: [["User", { as: "User", credentials: username && { username } }]],
    size,
    page,
  });
  return formatProjects(projects);
};

export const getOwnProjects = async (data: any) => {
  const { token } = data;
  const { user } = await verifyToken2(token);
  return await User.projects(DatabaseService, user);
};

export const addProject = async (data: any) =>
  await Project.new(DatabaseService, data);

export const deleteProject = async (data: any) =>
  await (await Project.load(DatabaseService, data)).remove(DatabaseService);

export const updateProject = async (data: any) =>
  await (
    await Project.load(DatabaseService, { uuid: data.uuid })
  ).update(DatabaseService, data);

// ! used only when the structure of a entity change and is necessary a reorder o modification of some attributes without change integrity of entity data
export const migrateDescriptionToDescriptions = async (data: any) => {
  const projects = await DatabaseService.command
    .setupEntity("Project")
    .findAll();
  console.log({ projects });
  for (var project of projects) {
    const descriptions = project.description.split(". ");
    console.log({ descriptions });
    await updateProject({ uuid: project.uuid, descriptions, user: data.user });
  }
  return "OK!";
};
