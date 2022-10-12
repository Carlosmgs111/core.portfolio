import { v4 as uuidv4 } from "uuid";

type ISkill = {
  uuid: string;
  userUUID: string;
  name: string;
  description: string;
  image: string;
};

export class Skill {
  uuid: string;
  userUUID: string;
  name: string;
  description: string;
  image: string;
  createdAt: number = 0;
  updatedAt: number = 0;

  constructor({ uuid, userUUID, name, description, image, }: ISkill) {
    this.uuid = uuid;
    this.userUUID = userUUID;
    this.name = name;
    this.description = description;
    this.image = image;
    this.createdAt = new Date().getTime();
    this.updatedAt = new Date().getTime();
  }
  static new = async (DatabaseServices: any, data: any): Promise<string> => {
    DatabaseServices.setupModel("Skill")
    const uuid = uuidv4();
    const account = new Skill({ ...data, uuid, userUUID: data.user.uuid });
    return await DatabaseServices.create(account);
  };

  static load = async (DatabaseServices: any, credentials: any) => {
    DatabaseServices.setupModel("Skill")
    const skill = await Skill.find(DatabaseServices, credentials);
    console.log({ Model: DatabaseServices.Model, credentials });
    if (!skill) throw new Error("Incorrect credentials!");
    const account = new Skill(skill);
    return account;
  };

  static find = async (DatabaseServices: any, credentials: any) => {
    DatabaseServices.setupModel("Skill")
    const { uuid } = credentials;
    const account: any = await DatabaseServices.findOne({
      uuid,
    });
    return account;
  };

  remove = async (DatabaseServices: any) => {
    DatabaseServices.setupModel("Skill")
    return await DatabaseServices.remove(this);
  };

  update = async (DatabaseServices: any, data:any) => {
    DatabaseServices.setupModel("Skill")
    this.updatedAt = new Date().getTime();
    return await DatabaseServices.update({...this, ...data});
  };
}
