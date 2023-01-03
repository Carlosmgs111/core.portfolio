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
  static new = async (DatabaseServices: any, data: any): Promise<string> => {
    const uuid = uuidv4();
    const project = await DatabaseServices.setupEntity("Project").relate2One(
      new Project({ ...data, uuid }),
      [{ user: { uuid: data.user.uuid } }]
    );
    return await DatabaseServices.create(project);
  };

  static load = async (DatabaseServices: any, credentials: any) => {
    DatabaseServices.setupEntity("Project");
    const loadedProject = await Project.find(DatabaseServices, credentials);
    if (!loadedProject) throw new Error("Incorrect credentials!");
    const project = new Project(loadedProject);
    return project;
  };

  static find = async (DatabaseServices: any, options: any) => {
    DatabaseServices.setupEntity("Project");
    const account: any = await DatabaseServices.findOne(options);
    return account;
  };

  static findAll = async (DatabaseServices: any, options: any = {}) => {
    DatabaseServices.setupEntity("Project");
    const projects: any = await DatabaseServices.findAll(options);
    return projects;
  };

  remove = async (DatabaseServices: any) => {
    DatabaseServices.setupEntity("Project");
    return await DatabaseServices.remove({ credentials: { uuid: this.uuid } });
  };

  update = async (DatabaseServices: any, data: any) => {
    DatabaseServices.setupEntity("Project");
    this.updatedAt = new Date().getTime();
    return await DatabaseServices.update(
      { ...this, ...data },
      { credentials: { uuid: this.uuid } }
    );
  };
}
