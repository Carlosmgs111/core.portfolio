import models from "../../../infrastructure/repositories/sequelize/src/models";
import { labelCases } from "../../../utils";
import { Model } from "sequelize";
import boom from "@hapi/boom";

export default class DatabaseSequelizeService {
  serviceDescription: string = "Sequelize Interface Database Service";
  Model: any;
  options: any = { include: [] };

  // ! Assingment of table in DDBB by use of '__identifier' parameter deprecated, use setModel instead
  constructor({ __identifier }: any) {
    this.Model = models[__identifier];
    this.syncModels();
  }
  create = async (Entity: any): Promise<typeof Model | null> => {
    const entity = await this.Model.create(Entity);
    return entity;
  };

  findAll = async () => {
    const entities = await this.Model.findAll(this.options);
    return entities;
  };

  findOne = async (Entity: any) => {
    try {
      const entity = await this.Model.findOne({
        where: Entity,
        ...this.options,
      });
      return entity;
    } catch (e: any) {
      console.log(e.message.red);
      throw boom.internal(e.message);
    } finally {
      this.clear();
    }
  };

  remove = async (Entity: any) => {
    return await this.Model.destroy({ where: { uuid: Entity.uuid } });
  };

  update = async (Entity: any) => {
    const model = await this.Model.update(Entity, {
      where: { uuid: Entity.uuid },
    });
    return model;
  };

  hasMany = async (Entity: any, label: string) => Entity[`get${label}`]();

  setupModel(__table: string) {
    this.Model = models[__table];
    return this;
  }

  include(entitiesLabel: string[] = []) {
    entitiesLabel.forEach(
      (e: any) =>
        (this.options.include = [
          ...this.options.include,
          { model: models[e], as: labelCases(e).CP },
        ])
    );
    return this;
  }

  clear() {
    this.options = { include: [] };
    this.Model = undefined;
    return this;
  }

  // * A function that is called in the constructor of the class. It is used to associate the models in
  // * the database.
  syncModels = () => {
    for (var model in models)
      models[model].associate && models[model].associate(models);
  };
}
