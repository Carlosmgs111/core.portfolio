import { filterAttrs } from "../../utils";
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
  static create = async (RepositoryService: any, data: any): Promise<Skill> => {
    const uuid = uuidv4();
    const skill = new Skill({ ...data, uuid });
    await RepositoryService.createOne(RepositoryService.entities.Skill, skill);
    await RepositoryService.createOneRelationshipN2N([
      [{ skill: { uuid } }, { user: { uuid: data.user.uuid } }],
    ]);
    return skill;
  };

  static createMany = async (RepositoryService: any, data: any) => {
    const skillsCreated = await RepositoryService.createMany(
      RepositoryService.entities.Skill,
      data.map((c: any) => new Skill({ ...c, uuid: c.uuid || uuidv4() }))
    );
    for (let skillIdx in data) {
      await RepositoryService.createOneRelationshipN2N([
        [
          {
            skill: {
              uuid: skillsCreated[Number(skillIdx)].uuid,
            },
          },
          { user: { uuid: data[Number(skillIdx)].user.uuid } },
        ],
      ]);
    }
    return skillsCreated;
  };

  static load = async (RepositoryService: any, credentials: any) => {
    const skill = await Skill.find(RepositoryService, credentials);
    ({ Model: RepositoryService.Model, credentials });
    if (!skill) throw new Error("Incorrect credentials!");
    const loadedSkill = new Skill(skill);
    return loadedSkill;
  };

  static find = async (RepositoryService: any, options: any) => {
    ({ options });
    const skill: any = await RepositoryService.findOne(
      RepositoryService.entities.Skill,
      options
    );
    return skill;
  };

  remove = async (RepositoryService: any, options: any = {}) => {
    const removed = await RepositoryService.removeOneRelationshipN2N([
      [{ user: { uuid: options.userUUID } }, { skill: { uuid: this.uuid } }],
    ]);

    if (!removed) return;

    return await RepositoryService.removeOne(RepositoryService.entities.Skill, {
      credentials: { uuid: this.uuid },
    });
  };

  update = async (RepositoryService: any, data: any) => {
    this.updatedAt = new Date().getTime();
    return await RepositoryService.updateOne(
      RepositoryService.entities.Skill,
      {
        updatedAt: this.updatedAt,
        ...filterAttrs(data, ["uuid", "user", "token"]),
      },
      { credentials: { uuid: this.uuid } }
    );
  };
}
