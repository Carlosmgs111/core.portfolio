import "../../../infrastructure/repositories/mongoose";
import models from "../../../infrastructure/repositories/mongoose/models";
import { model } from "mongoose";

export default class DatabaseMongooseService {
  __identifier: string;
  constructor({ __identifier }: any) {
    this.__identifier = __identifier;
  }
  create = async (Entity: any): Promise<typeof model | null> => {
    const Model = models[this.__identifier];
    const entity = new Model(Entity);
    await entity.save();
    return entity;
  };

  findAll = async () => {
    const Model = models[this.__identifier];
    const entities = await Model.find();
    return entities;
  };

  findOne = async (Entity: any) => {
    const Model = models[this.__identifier];
    const entity = await Model.findOne(Entity);
    return entity;
  };

  remove = async (Entity: any) => {
    const Model = models[this.__identifier];
    return await Model.deleteOne(Entity);
  };

  update = async (Entity: any) => {
    const Model = models[this.__identifier];
    const model = await Model.updateOne({ uuid: Entity.uuid }, Entity);
    return model;
  };
  setup = (__identifier:string)=>this.__identifier=__identifier
}
