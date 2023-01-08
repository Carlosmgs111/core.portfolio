import { connect } from "../../../infrastructure/repositories/mongoose";
import models from "../../../infrastructure/repositories/mongoose/models";
import { model } from "mongoose";
import { labelCases, Mapfy } from "../../../utils";
import boom from "@hapi/boom";
export default class MongooseAdapter {
  serviceDescription: string = "Mongoose Database Service Adapter";
  Entity: any;

  constructor({}: any) {
    connect();
  }

  create = async (
    Entity: any,
    options: any = {}
  ): Promise<typeof model | null> => {
    const entity = this.Entity.create(Entity);
    return entity;
  };

  createMany = async (entities: any, options: any) => {
    const entitiesCreated = this.Entity.insertMany(entities);
    return entitiesCreated;
  };

  findAll = async (options: any) => {
    const { size = 100, page = 0 } = options;
    const { related = [] } = options;
    const entities = await this.Entity.find(this.adapter(options))
      .populate(this.getPopulateMap(related))
      .limit(Number(size))
      .skip(Number(page));
    return entities.map((e: any) => ({ ...e._doc }));
  };

  findOne = async (options: any) => {
    const { credentials, related = [] } = options;
    const entity = await this.Entity.findOne(credentials).populate(
      this.getPopulateMap(related)
    );
    if (!entity) return null;
    return entity._doc;
  };

  remove = async (options: any) => {
    if (!options.credentials)
      throw boom.forbidden(
        "Must supply credentials for find and delete entity!"
      );
    return await this.Entity.deleteOne(this.adapter(options));
  };

  update = async (Entity: any, options: any) => {
    const model = await this.Entity.updateOne(this.adapter(options), Entity);
    return model._doc;
  };

  // TODO rename to createRelationship
  relateN2N = async (refs: any) => {
    for (let ref of refs) {
      const [from, to] = ref;
      const [exist, { fromModel, toModel }]: any = await this.checkRelationship(
        from,
        to
      );
      if (exist) throw boom.conflict("Entity exist yet!");
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
    }
  };

  // TODO rename to removeRelationship
  unrelateN2N = async (refs: any) => {
    for (let ref of refs) {
      const [from, to] = ref;
      const [
        exist,
        {
          fromModel,
          toModel,
          fromRelated,
          toRelated,
          fromRelatedIndex,
          toRelatedIndex,
        },
      ]: any = await this.checkRelationship(from, to);
      if (!exist) throw boom.conflict("Entity exist yet!");

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
    }
  };

  relate2One = async (entity: any, refs: any) => {
    const relations2One: any = {};
    for (let ref of refs) {
      const key = Mapfy(ref).keys().next().value;
      const value = Mapfy(ref).values().next().value;
      const referenced = await models[labelCases(key).CS].findOne(value);
      relations2One[labelCases(key).CS] = referenced._id;
    }
    return { ...entity, ...relations2One };
  };

  // ? Pending to test
  unrelate2One = async (entity: any, refs: any) => {
    const relations2One: any = {};
    for (let ref of refs) {
      relations2One[labelCases(ref).CS] = null;
    }
    return { ...entity, ...relations2One };
  };

  checkRelationship = async (from: any, to: any) => {
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
    const exist = fromRelatedIndex !== -1 || toRelatedIndex !== -1;

    return [
      exist,
      {
        fromModel,
        toModel,
        fromRelated,
        toRelated,
        fromRelatedIndex,
        toRelatedIndex,
      },
    ];
  };

  hasMany = () => {};

  adapter = (options: any) => {
    const { credentials, related } = options;
    return credentials;
  };

  getPopulateMap = (related: any) => {
    const populates: any = [];
    related.forEach((r: any) => {
      const [label, { as = null, attributes = [] } = {}] = r;
      let select = "-_id"; // ? for exclude _id attribute
      attributes.forEach((a: any) => (select += `${a} `));
      populates.push({ path: as || labelCases(label).CP, select });
    });
    return populates;
  };

  formatIncludeClosure = async (entitiesToInclude: any) => {};

  setupEntity(entityLabel: string) {
    this.Entity = models[entityLabel];
    return this;
  }

  syncModels = () => {};
}
