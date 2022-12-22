import models from "../../../infrastructure/repositories/sequelize/src/models";
import { labelCases } from "../../../utils";
import { Model } from "sequelize";
import boom from "@hapi/boom";

export default class DatabaseSequelizeService {
  serviceDescription: string = "Sequelize Interface Database Service";
  Model: any;

  // ! Assingment of table in DDBB by use of '__identifier' parameter deprecated, use setModel instead
  constructor({ __identifier }: any) {
    this.Model = models[__identifier];
    this.syncModels();
  }
  create = async (Entity: any): Promise<typeof Model | null> => {
    const entity = await this.Model.create(Entity);
    return entity;
  };

  findAll = async ({ options }: any = {}) => {
    const entities = await this.Model.findAll(options);
    return entities;
  };

  findOne = async ({ credentials, options }: any = {}) => {
    try {
      const entity = await this.Model.findOne({
        where: credentials,
        ...options,
      });
      return entity;
    } catch (e: any) {
      console.log(e.message.red);
      throw boom.internal(e.message);
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

  // ? pending to find an appropiated agnosthic name
  getInclude(entitiesToInclude: any = []) {
    const include: Object[] = [];
    entitiesToInclude.forEach((e: any) => {
      const [
        label,
        { attributes = null, where = {}, alias = null, singular = false } = {},
      ] = e;
      include.push({
        model: models[label],
        as: alias || labelCases(label)[singular ? "CS" : "CP"],
        attributes,
        where,
      });
    });
    return include;
  }

  setupModel(__table: string) {
    this.Model = models[__table];
    return this;
  }

  // ? Pending to check if it can be implemented as agnosthic way for be using at least with Sequelize and Mongoose
  hasMany = async (Entity: any, label: string) => Entity[`get${label}`]();

  // * A function that is called in the constructor of the class. It is used to associate the models in
  // * the database.
  syncModels = () => {
    for (var model in models)
      models[model].associate && models[model].associate(models);
  };
}
