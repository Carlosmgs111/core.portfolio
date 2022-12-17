import { v4 as uuidv4 } from "uuid";

type IProject = {
  uuid: string;
  userUUID: string;
  name: string;
  descriptions: string[];
  images: string[];
  tags: string[];
  uri: string;
  version: string;
};

export class Project {
  uuid: string;
  userUUID: string;
  name: string;
  descriptions: string[];
  images: string[];
  tags: string[];
  uri: string;
  version: string;
  createdAt: number = 0;
  updatedAt: number = 0;

  constructor({ uuid, userUUID, name, descriptions, images, tags, uri, version }: IProject) {
    this.uuid = uuid;
    this.userUUID = userUUID;
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
    DatabaseServices.setupModel("Project")
    const uuid = uuidv4();
    const account = new Project({ ...data, uuid, userUUID: data.user.uuid });
    return await DatabaseServices.create(account);
  };

  static load = async (DatabaseServices: any, credentials: any) => {
    DatabaseServices.setupModel("Project")
    const project = await Project.find(DatabaseServices, credentials);
    if (!project) throw new Error("Incorrect credentials!");
    const account = new Project(project);
    return account;
  };

  static find = async (DatabaseServices: any, credentials: any) => {
    DatabaseServices.setupModel("Project")
    const { uuid } = credentials;
    const account: any = await DatabaseServices.findOne({
      uuid,
    });
    return account;
  };

  remove = async (DatabaseServices: any) => {
    DatabaseServices.setupModel("Project")
    return await DatabaseServices.remove(this);
  };

  update = async (DatabaseServices: any, data:any) => {
    DatabaseServices.setupModel("Project")
    this.updatedAt = new Date().getTime();
    return await DatabaseServices.update({...this, ...data});
  };
}
