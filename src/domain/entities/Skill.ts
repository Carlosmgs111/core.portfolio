import { v4 as uuidv4 } from "uuid";

type ISkill = {
  uuid: string;
  userUUID: string;
  name: string;
  description: string;
  image: string;
  tags: string[];
};

export class Skill {
  uuid: string;
  userUUID: string;
  name: string;
  description: string;
  image: string;
  tags: string[];
  createdAt: number = 0;
  updatedAt: number = 0;

  constructor({ uuid, userUUID, name, description, image, tags }: ISkill) {
    this.uuid = uuid;
    this.userUUID = userUUID;
    this.name = name;
    this.description = description;
    this.image = image;
    this.tags = tags;
    this.createdAt = new Date().getTime();
    this.updatedAt = new Date().getTime();
  }
  static create = async (DatabaseServices: any, data: any): Promise<string> => {
    const uuid = uuidv4();
    const skill = new Skill({ ...data, uuid, userUUID: data.user.uuid });
    return await DatabaseServices.create(
      DatabaseServices.entities.Skill,
      skill
    );
  };

  static load = async (DatabaseServices: any, credentials: any) => {
    const skill = await Skill.find(DatabaseServices, credentials);
    console.log({ Model: DatabaseServices.Model, credentials });
    if (!skill) throw new Error("Incorrect credentials!");
    const loadedSkill = new Skill(skill);
    return loadedSkill;
  };

  static find = async (DatabaseServices: any, credentials: any) => {
    const skill: any = await DatabaseServices.findOne(
      DatabaseServices.entities.Skill,
      {
        credentials,
      }
    );
    return skill;
  };

  remove = async (DatabaseServices: any) => {
    return await DatabaseServices.remove(DatabaseServices.entities.Skill, {
      credentials: { uuid: this.uuid },
    });
  };

  update = async (DatabaseServices: any, data: any) => {
    this.updatedAt = new Date().getTime();
    return await DatabaseServices.update(
      DatabaseServices.entities.Skill,
      { ...this, ...data },
      { credentials: { uuid: this.uuid } }
    );
  };
}
