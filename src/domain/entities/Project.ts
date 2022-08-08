import { v4 as uuidv4 } from "uuid";

type IProject = {
  uuid: string;
  name: string;
  description: string;
  uri: string;
  version: string;
};

export class Project {
  uuid: string;
  name: string;
  description: string;
  uri: string;
  version: string;
  createdAt: number = 0;
  updatedAt: number = 0;

  constructor({ uuid, name, description, uri, version }: IProject) {
    this.uuid = uuid;
    this.name = name;
    this.description = description;
    this.uri = uri;
    this.version = version;
    this.createdAt = new Date().getTime();
    this.updatedAt = new Date().getTime();
  }
  static new = async (DatabaseServices: any, data: any): Promise<string> => {
    const uuid = uuidv4();
    const account = new Project({ ...data, uuid });
    return await DatabaseServices.create(account);
  };

  static load = async (DatabaseServices: any, credentials: any) => {
    const project = await Project.find(DatabaseServices, credentials);
    if (!project) throw new Error("Incorrect credentials!");
    const account = new Project(project);
    return account;
  };

  static find = async (DatabaseServices: any, credentials: any) => {
    const { email } = credentials;
    const account: any = await DatabaseServices.findOne({
      email,
    });
    return account;
  };

  remove = async (DatabaseServices: any) => {
    return await DatabaseServices.remove(this);
  };

  update = async (DatabaseServices: any) => {
    this.updatedAt = new Date().getTime();
    return await DatabaseServices.update(this);
  };
}
