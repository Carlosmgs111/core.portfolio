import { filterAttrs } from "../../utils";
import { v4 as uuidv4 } from "uuid";
import { kind, state, stack } from "src/enums";

type IProject = {
  uuid: string;
  // userUUID: string;
  name: string;
  descriptions: string[];
  images: string[];
  tags: string[];
  stack: stack[];
  state: state;
  kind: kind[];
  uri: string;
  version: string;
};

export class Project {
  uuid: string;
  // userUUID: string;
  name: string;
  descriptions: string[];
  images: string[];
  tags: string[];
  stack: stack[];
  state: state;
  kind: kind[];
  uri: string;
  version: string;
  createdAt: number = 0;
  updatedAt: number = 0;

  constructor({
    uuid,
    // userUUID,
    name,
    descriptions,
    images,
    tags,
    stack,
    state,
    kind,
    uri,
    version,
  }: IProject) {
    this.uuid = uuid;
    // this.userUUID = userUUID;
    this.name = name;
    this.descriptions = descriptions;
    this.images = images;
    this.tags = tags;
    this.stack = stack;
    this.state = state;
    this.kind = kind;
    this.uri = uri;
    this.version = version;
    this.createdAt = new Date().getTime();
    this.updatedAt = new Date().getTime();
  }
  static new = async (RepositoryService: any, data: any): Promise<string> => {
    const uuid = uuidv4();
    const newProject = await RepositoryService.createOne(
      RepositoryService.entities.Project,
      new Project({ ...data, uuid })
    );
    // * Create relation Many to Many between User and Project entity
    await RepositoryService.createOneRelationshipN2N([
      [{ project: { uuid } }, { user: { uuid: data.user.uuid } }],
    ]);

    return newProject;
  };

  static createMany = async (RepositoryService: any, data: any) => {
    console.log({ data });
    const projectsCreated = await RepositoryService.createMany(
      RepositoryService.entities.Project,
      data.map((c: any) => new Project({ ...c, uuid: c.uuid || uuidv4() }))
    );
    for (let projectIdx in data) {
      await RepositoryService.createOneRelationshipN2N([
        [
          {
            project: {
              uuid: projectsCreated[Number(projectIdx)].uuid,
            },
          },
          { user: { uuid: data[Number(projectIdx)].user.uuid } },
        ],
      ]);
    }
    return projectsCreated.map((p: any, i: any) => ({
      ...p,
      Users: [{ username: data[i].user.username }],
    }));
  };

  static load = async (RepositoryService: any, options: any) => {
    const loadedProject = await Project.find(RepositoryService, options);
    if (!loadedProject) throw new Error("Incorrect credentials!");
    const project = new Project(loadedProject);
    return project;
  };

  static find = async (RepositoryService: any, options: any) => {
    const account: any = await RepositoryService.findOne(
      RepositoryService.entities.Project,
      options
    );
    return account;
  };

  static findAll = async (RepositoryService: any, options: any = {}) => {
    const projects: any = await RepositoryService.findAll(
      RepositoryService.entities.Project,
      options
    );
    return projects;
  };

  remove = async (RepositoryService: any, options: any = {}) => {
    const { uuid } = this;
    const removed = await RepositoryService.removeOneRelationshipN2N([
      [{ user: { uuid: options.userUUID } }, { project: { uuid: this.uuid } }],
    ]);

    if (!removed) return;
    return await RepositoryService.removeOne(
      RepositoryService.entities.Project,
      {
        credentials: { uuid },
      }
    );
  };

  update = async (RepositoryService: any, data: any) => {
    this.updatedAt = new Date().getTime();
    return await RepositoryService.updateOne(
      RepositoryService.entities.Project,
      {
        updatedAt: this.updatedAt,
        ...filterAttrs(data, ["uuid", "user", "token"]),
      },
      { credentials: { uuid: this.uuid } }
    );
  };
}
