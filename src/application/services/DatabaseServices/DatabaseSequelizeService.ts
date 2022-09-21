import models from "../../../infrastructure/repositories/sequelize/src/models";
import { Model } from "sequelize";

export default class DatabaseSequelizeService {
  Model: any;
  constructor({ __identifier }: any) {
    this.Model = models[__identifier];
    this.syncModels();
  }
  create = async (Entity: any): Promise<typeof Model | null> => {
    const entity = await this.Model.create(Entity);
    return entity;
  };

  findAll = async () => {
    console.log("FIND ALL!")
    console.log({MODEL: this.Model})
    const entities = await this.Model.findAll();
    return entities;
  };

  findOne = async (Entity: any) => {
    await console.log({Entity})
    try {
      const entity = await this.Model.findOne({ where: Entity });
      return entity;
    } catch (e) {
      return null;
    }
  };

  remove = async (Entity: any) => {
    return await this.Model.destroy({ where: { uuid: Entity.uuid } });
  };

  update = async (Entity: any) => {
    console.log({Entity})
    const model = await this.Model.update(Entity, {
      where: { uuid: Entity.uuid },
    });
    return model;
  };

  setupModel(__identifier: string) {
    this.Model = models[__identifier];
    return this;
  }

  syncModels = () => {
    for (var model in models)
      models[model].associate ? models[model].associate(models) : null;
  };
}
