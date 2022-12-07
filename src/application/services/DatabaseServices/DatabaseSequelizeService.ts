import models from "../../../infrastructure/repositories/sequelize/src/models";
import { Model } from "sequelize";

export default class DatabaseSequelizeService {
  Model: any;
  serviceDescription: string = "Sequelize Interface Database Service"

  // ! Assingment of table in DDBB by use of '__identifier' parameter deprecated, use setModel instead
  constructor({ __identifier, env }: any) {
    this.Model = models[__identifier];
    this.syncModels();
  }
  create = async (Entity: any): Promise<typeof Model | null> => {
    const entity = await this.Model.create(Entity);
    return entity;
  };

  findAll = async () => {
    const entities = await this.Model.findAll();
    return entities;
  };

  findOne = async (Entity: any) => {
    await console.log({ Entity })
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
    // console.log({Entity})
    const model = await this.Model.update(Entity, {
      where: { uuid: Entity.uuid },
    });
    return model;
  };

  setupModel(__table: string) {
    this.Model = models[__table];
    return this;
  }

  // * A function that is called in the constructor of the class. It is used to associate the models in
  // * the database. 
  syncModels = () => {
    for (var model in models)
      models[model].associate && models[model].associate(models);
  };

}
