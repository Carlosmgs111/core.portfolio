import { connect } from "../../../infrastructure/repositories/mongoose";
import models from "../../../infrastructure/repositories/mongoose/models";
import { model } from "mongoose";
import { labelCases } from "../../../utils";
import boom from "@hapi/boom";

export default class DatabaseMongooseService {
  serviceDescription: string = "Mongoose Interface Database Service";
  Entity: any;

  constructor({}: any) {
    connect();
  }

  create = async (
    Entity: any,
    options: any = {}
  ): Promise<typeof model | null> => {
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
    const entity = await this.Entity.findOne(credentials);
    console.log({ entity });
    return entity;
  };

  remove = async (Entity: any) => {
    return await this.Entity.deleteOne(this.adapter(Entity));
  };

  update = async (Entity: any, options: any) => {
    const model = await this.Entity.updateOne(this.adapter(options), Entity);
    return model;
  };

  // TODO rename to createRelationship
  // ? add a check method that search for a uuid similar to be introduced
  relate = async (from: any, to: any) => {
    const fromModel = await models[labelCases(from.label).CS].findOne({
      uuid: from.uuid,
    });
    const toModel = await models[labelCases(to.label).CS].findOne({
      uuid: to.uuid,
    });

    await fromModel.updateOne(
      {
        [labelCases(to.label).CP]: [
          ...fromModel[labelCases(to.label).CP],
          to.uuid,
        ],
      },
      {
        uuid: from.uuid,
      }
    );
    await toModel.updateOne(
      {
        [labelCases(from.label).CP]: [
          ...toModel[labelCases(from.label).CP],
          from.uuid,
        ],
      },
      {
        uuid: to.uuid,
      }
    );
  };

  // TODO rename to removeRelationship
  unrelate = async (from: any, to: any) => {
    const fromModel = await models[labelCases(from.label).CS].findOne({
      uuid: from.uuid,
    });
    const toModel = await models[labelCases(to.label).CS].findOne({
      uuid: to.uuid,
    });
    const fromRelated = fromModel[labelCases(to.label).CP];
    const fromRelatedIndex = fromModel[labelCases(to.label).CP].indexOf(
      to.uuid
    );

    const toRelated = toModel[labelCases(from.label).CP];
    const toRelatedIndex = toModel[labelCases(from.label).CP].indexOf(
      from.uuid
    );

    if (fromRelatedIndex === -1 || toRelatedIndex === -1)
      throw boom.internal("Entity related was not found!");

    fromRelated.splice(fromRelatedIndex, 1);
    toRelated.splice(toRelatedIndex, 1);

    await fromModel.updateOne(
      {
        [labelCases(to.label).CP]: [...fromRelated],
      },
      {
        uuid: from.uuid,
      }
    );
    await toModel.updateOne(
      {
        [labelCases(from.label).CP]: [...toRelated],
      },
      {
        uuid: to.uuid,
      }
    );
  };

  checkRelationship = async ({}: any, {}: any) => [true];

  hasMany = () => {};

  adapter = (options: any) => {
    const { credentials } = options;
    return credentials;
  };

  formatIncludeClosure = async () => {};

  setupEntity(entityLabel: string) {
    this.Entity = models[entityLabel];
    return this;
  }

  syncModels = () => {};
}
