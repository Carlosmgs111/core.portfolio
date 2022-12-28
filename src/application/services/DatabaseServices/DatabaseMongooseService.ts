import { connect } from "../../../infrastructure/repositories/mongoose";
import models from "../../../infrastructure/repositories/mongoose/models";
import { model } from "mongoose";

export default class DatabaseMongooseService {
  serviceDescription: string = "Mongoose Interface Database Service";
  Entity: any;

  constructor({}: any) {
    connect();
  }

  create = async (Entity: any, options: any): Promise<typeof model | null> => {
    const entity = new this.Entity(Entity);
    await entity.save();
    return entity;
  };

  findAll = async (options: any) => {
    const entities = await this.Entity.find(this.adapter(options));
    return entities;
  };

  findOne = async (Entity: any) => {
    const { credentials } = Entity;
    console.log({ models });
    const entity = await this.Entity.findOne(credentials);
    return entity;
  };

  remove = async (Entity: any) => {
    return await this.Entity.deleteOne(Entity);
  };

  update = async (Entity: any) => {
    const model = await this.Entity.updateOne({ uuid: Entity.uuid }, Entity);
    return model;
  };

  getRelated = async () => {};

  relate = async () => {};

  unrelate = async () => {};

  checkRelationship = async () => {};

  adapter = (options: any) => {
    const { credentials } = options;
    return { where: credentials };
  };

  hasMany = () => {};

  setupEntity(entityLabel: string) {
    this.Entity = models[entityLabel];
    return this;
  }

  syncModels = () => {};
}
