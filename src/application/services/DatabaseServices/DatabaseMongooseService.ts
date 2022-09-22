import "../../../infrastructure/repositories/mongoose";
import models from "../../../infrastructure/repositories/mongoose/models";
import { model } from "mongoose";

export default class DatabaseMongooseService {
  Model: any;
  name:string = "Mongoose Interface Database Service"

  constructor({ __identifier }: any) {
    this.Model = models[__identifier]
  }
  create = async (Entity: any): Promise<typeof model | null> => {
    const entity = new this.Model(Entity);
    await entity.save();
    return entity;
  };

  findAll = async () => {
    const entities = await this.Model.find();
    return entities;
  };

  findOne = async (Entity: any) => {
    const entity = await this.Model.findOne(Entity);
    return entity;
  };

  remove = async (Entity: any) => {
    return await this.Model.deleteOne(Entity);
  };

  update = async (Entity: any) => {
    const model = await this.Model.updateOne({ uuid: Entity.uuid }, Entity);
    return model;
  };
  setupModel(__identifier: string) {
    this.Model = models[__identifier]
    return this;
  };
}
