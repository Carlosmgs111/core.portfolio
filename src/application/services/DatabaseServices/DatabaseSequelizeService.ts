import models from "../../../infrastructure/repositories/sequelize/models";
import { Model } from "sequelize";

export default class DatabaseSequelizeService {
  __identifier: string;
  constructor({ __identifier }: any) {
    this.__identifier = __identifier;
  }
  create = async (Entity: any): Promise<typeof Model | null> => {
    const Model = models[this.__identifier];
    await Model.sync({ alter: true });
    const entity = await Model.create(Entity);
    return entity;
  };

  findAll = async () => {
    const Model = models[this.__identifier];
    await Model.sync({ alter: true });
    const entities = await Model.find();
    return entities;
  };

  findOne = async (Entity: any) => {
    const Model = models[this.__identifier];
    await Model.sync({ alter: true });
    try {
      const entity = await Model.findOne({ where: Entity });
      return entity;
    } catch (e) {
      return null;
    }
  };

  remove = async (Entity: any) => {
    const Model = models[this.__identifier];
    return await Model.destroy({ where: Entity });
  };

  update = async (Entity: any) => {
    const Model = models[this.__identifier];
    const model = await Model.update( Entity,{ where: { uuid: Entity.uuid } },);
    return model;
  };
}
