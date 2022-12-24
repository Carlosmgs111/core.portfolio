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
  create = async (
    Entity: any,
    options: any = {}
  ): Promise<typeof Model | null> => {
    const entity = await this.Model.create(Entity, this.adapter(options));
    return entity;
  };

  findAll = async (options: any = {}) => {
    const entities = await this.Model.findAll(this.adapter(options));
    return entities;
  };

  findOne = async (options: any = {}) => {
    console.log({ options });
    try {
      const entity = await this.Model.findOne(this.adapter(options));
      return entity;
    } catch (e: any) {
      console.log(e.message.red);
      throw boom.internal(e.message);
    }
  };

  remove = async (options: any) => {
    return await this.Model.destroy(this.adapter(options));
  };

  update = async (Entity: any, options: any = {}) => {
    const model = await this.Model.update(Entity, this.adapter(options));
    return model;
  };

  // ? pending to find an appropiated agnosthic name
  getRelated(entitiesToInclude: any = []) {
    const include: Object[] = [];
    entitiesToInclude.forEach((e: any) => {
      const [model, queryOps = {}, options = {}] = e;
      const { singular = false } = options;
      const {
        attributes = null,
        where = {},
        as = null,
      } = this.adapter(queryOps);
      include.push({
        model: models[model],
        as: as || labelCases(model)[singular ? "CS" : "CP"],
        attributes,
        where,
      });
    });
    return include;
  }

  adapter = (OPS: any) => {
    const {
      credentials = {},
      related = [],
      size = 100,
      page = 0,
      as = null,
    }: any = OPS;
    return {
      ...OPS,
      where: credentials,
      include: related,
      limit: size,
      offset: page,
      alias: as,
    };
  };

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
