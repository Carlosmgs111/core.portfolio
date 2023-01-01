import { connect } from "../../../infrastructure/repositories/mongoose";
import models from "../../../infrastructure/repositories/mongoose/models";
import { model } from "mongoose";
import { labelCases, Mapfy } from "../../../utils";
import boom from "@hapi/boom";

console.log({ models });
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
    const { related = [] } = options;
    const entities = await this.Entity.find(this.adapter(options)).populate(
      this.getPopulateMap(related)
    );
    console.log({ entities });
    return entities;
  };

  findOne = async (options: any) => {
    const { credentials, related = [] } = options;
    const entity = await this.Entity.findOne(credentials).populate(
      this.getPopulateMap(related)
    );
    await console.log({ entity });
    return entity;
  };

  remove = async (options: any) => {
    return await this.Entity.deleteOne(this.adapter(options));
  };

  update = async (Entity: any, options: any) => {
    const model = await this.Entity.updateOne(this.adapter(options), Entity);
    return model;
  };

  // TODO rename to createRelationship
  // ? add a check method that search for a uuid similar to be introduced
  relate = async (from: any, to: any) => {
    const fromModel = await models[labelCases(from.label).CS].findOne({
      uuid: from.pk,
    });
    const toModel = await models[labelCases(to.label).CS].findOne({
      uuid: to.pk,
    });

    await fromModel.updateOne(
      {
        [labelCases(to.label).CP]: [
          ...fromModel[labelCases(to.label).CP],
          toModel._id,
        ],
      },
      {
        uuid: from.pk,
      }
    );
    await toModel.updateOne(
      {
        [labelCases(from.label).CP]: [
          ...toModel[labelCases(from.label).CP],
          fromModel._id,
        ],
      },
      {
        uuid: to.pk,
      }
    );
  };

  // TODO rename to removeRelationship
  unrelate = async (from: any, to: any) => {
    const fromModel = await models[labelCases(from.label).CS].findOne({
      uuid: from.pk,
    });
    const toModel = await models[labelCases(to.label).CS].findOne({
      uuid: to.pk,
    });
    const fromRelated = fromModel[labelCases(to.label).CP];
    const fromRelatedIndex = fromModel[labelCases(to.label).CP].indexOf(
      toModel._id
    );

    const toRelated = toModel[labelCases(from.label).CP];
    const toRelatedIndex = toModel[labelCases(from.label).CP].indexOf(
      fromModel._id
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
        uuid: from.pk,
      }
    );
    await toModel.updateOne(
      {
        [labelCases(from.label).CP]: [...toRelated],
      },
      {
        uuid: to.pk,
      }
    );
  };

  checkRelationship = async ({}: any, {}: any) => [true];

  hasMany = () => {};

  adapter = (options: any) => {
    const { credentials, related } = options;
    return credentials;
  };

  getPopulateMap = (related: any) => {
    const populates: any = [];
    related.forEach((r: any) => {
      const [label, { as = null } = {}] = r;
      console.log();
      populates.push({ path: as || labelCases(label).CP });
    });
    console.log({ populates });
    return populates;
  };

  formatIncludeClosure = async (entitiesToInclude: any) => {};

  setupEntity(entityLabel: string) {
    this.Entity = models[entityLabel];
    return this;
  }

  syncModels = () => {};
}
