import { v4 as uuidv4 } from "uuid";

type IProject = {
  uuid: string;
  // userUUID: string;
  name: string;
  descriptions: string[];
  images: string[];
  tags: string[];
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
    uri,
    version,
  }: IProject) {
    this.uuid = uuid;
    // this.userUUID = userUUID;
    this.name = name;
    this.descriptions = descriptions;
    this.images = images;
    this.tags = tags;
    this.uri = uri;
    this.version = version;
    this.createdAt = new Date().getTime();
    this.updatedAt = new Date().getTime();
  }
  static new = async (RepositoryService: any, data: any): Promise<string> => {
    const uuid = uuidv4();
    const project = await RepositoryService.relate2One(
      new Project({ ...data, uuid }),
      [{ user: { uuid: data.user.uuid } }]
    );
    return await RepositoryService.create(
      RepositoryService.entities.Project,
      project
    );
  };

  static load = async (RepositoryService: any, credentials: any) => {
    const loadedProject = await Project.find(RepositoryService, credentials);
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

  remove = async (RepositoryService: any) => {
    return await RepositoryService.remove(RepositoryService.entities.Project, {
      credentials: { uuid: this.uuid },
    });
  };

  update = async (RepositoryService: any, data: any) => {
    this.updatedAt = new Date().getTime();
    return await RepositoryService.update(
      RepositoryService.entities.Project,
      { ...this, ...data },
      { credentials: { uuid: this.uuid } }
    );
  };
}
