import models from "../../../infrastructure/repositories/sequelize/src/models";
import { Model } from "sequelize";

export default class DatabaseSequelizeService {
  __identifier: string;
  Model: any;
  constructor({ __identifier }: any) {
    this.__identifier = __identifier;
    this.Model = models[__identifier]
  }
  create = async (Entity: any): Promise<typeof Model | null> => {
    await this.Model.sync({ alter: true });
    const entity = await this.Model.create(Entity);
    return entity;
  };

  findAll = async () => {
    await this.Model.sync({ alter: true });
    const entities = await this.Model.find();
    return entities;
  };

  findOne = async (Entity: any) => {
    await this.Model.sync({ alter: true });
    try {
      const entity = await this.Model.findOne({ where: Entity });
      return entity;
    } catch (e) {
      return null;
    }
  };

  remove = async (Entity: any) => {
    return await this.Model.destroy({ where: Entity });
  };

  update = async (Entity: any) => {
    const model = await this.Model.update( Entity,{ where: { uuid: Entity.uuid } },);
    return model;
  };

  setup = (__identifier: string) => {
    console.log(this)
    this.__identifier = __identifier;
    this.Model = models[__identifier]
    return this;
  };

  associate = async(Entity: any)=>{
    
  }
}
