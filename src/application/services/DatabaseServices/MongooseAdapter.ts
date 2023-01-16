import { connect } from "../../../infrastructure/repositories/mongoose";
import models from "../../../infrastructure/repositories/mongoose/models";
import { model } from "mongoose";
import { labelCases, Mapfy, setEnums } from "../../../utils";
import boom from "@hapi/boom";
export default class MongooseAdapter {
  serviceDescription: string = "Mongoose Database Service Adapter";
  Entity: any;

  constructor({}: any) {
    connect();
  }

  createOne = async (
    entity: any,
    Entity: any,
    options: any = {}
  ): Promise<typeof model | null> => {
    const newEntity = await models[entity].create(Entity);
    return newEntity._doc;
  };

  createMany = async (entity: any, entities: any, options: any) => {
    const entitiesCreated = await models[entity].insertMany(entities);
    return entitiesCreated.map((e: any) => ({ ...e._doc }));
  };

  findAll = async (entity: any, options: any) => {
    const { size = 100, page = 0 } = options;
    const { related = [] } = options;
    const entities = await models[entity]
      .find(this.adapter(options))
      .populate(this.getPopulateMap(related))
      .limit(Number(size))
      .skip(Number(page));
    return entities.map((e: any) => ({ ...e._doc }));
  };

  findOne = async (entity: any, options: any) => {
    const { credentials, related = [] } = options;
    const entityFounded = await models[entity]
      .findOne(credentials)
      .populate(this.getPopulateMap(related));
    if (!entityFounded) return null;
    return entityFounded._doc;
  };

  removeOne = async (entity: any, options: any) => {
    if (!options.credentials)
      throw boom.forbidden(
        "Must supply credentials for find and delete entity!"
      );
    return await models[entity].deleteOne(this.adapter(options));
  };

  updateOne = async (entity: any, Entity: any, options: any) => {
    const model = await models[entity].updateOne(this.adapter(options), Entity);
    return model._doc;
  };

  createOneRelationshipN2N = async (refs: any) => {
    for (let ref of refs) {
      const [from, to] = ref;
      const [exist, { fromModel, toModel }]: any =
        await this.checkOneRelationshipN2N(from, to);
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
  removeOneRelationshipN2N = async (refs: any) => {
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
      ]: any = await this.checkOneRelationshipN2N(from, to);
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

  createOneRelationship2One = async (entity: any, refs: any) => {
    const relations2One: any = {};
    const mainKey = Mapfy(entity).keys().next().value;
    const mainValue = Mapfy(entity).values().next().value;

    const { _id } = await models[labelCases(mainKey).CS].findOne(mainValue, {
      select: "_id",
    });

    for (let ref of refs) {
      const key = Mapfy(ref).keys().next().value;
      const value = Mapfy(ref).values().next().value;
      const referenced = await models[labelCases(key).CS].findOne(value);
      relations2One[labelCases(key).CS] = referenced._id;

      await models[labelCases(key).CS].updateOne(value, {
        [labelCases(mainKey).CP]: [...referenced[labelCases(mainKey).CP], _id],
      });
    }
    await models[labelCases(mainKey).CS].updateOne(mainValue, relations2One);
    return { ...entity, ...relations2One };
  };

  // ? Pending to test
  removeOneRelationship2One = async (entity: any, refs: any) => {
    const mainKey = Mapfy(entity).keys().next().value;
    const mainValue = Mapfy(entity).values().next().value;
    const relations2One: any = {};
    const Entity = await models[labelCases(mainKey).CS]
      .findOne(mainValue)
      .populate(this.getPopulateMap(refs, true));
    for (let ref of refs) {
      const [label] = ref;
      relations2One[labelCases(label).CS] = "";
      const referenced = (
        await models[labelCases(label).CS]
          .findOne(Entity[labelCases(label).CS])
          .select(labelCases(mainKey).CP)
      )[labelCases(mainKey).CP];

      await models[labelCases(label).CS].updateOne(
        Entity[labelCases(label).CS],
        {
          [labelCases(mainKey).CP]: [
            ...referenced.filter((r: any) => r !== String(Entity._id)),
          ],
        }
      );
    }

    return { ...entity, ...relations2One };
  };

  checkOneRelationshipN2N = async (from: any, to: any) => {
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

  private adapter = (options: any) => {
    const { credentials, related } = options;
    return credentials;
  };

  private getPopulateMap = (related: any, include_id: boolean = false) => {
    const populates: any = [];
    related.forEach((r: any) => {
      const [label, { as = null, attributes = [] } = {}] = r;
      let select = `${include_id ? "_id" : "-_id"}`; // ? for exclude _id attribute
      attributes.forEach((a: any) => (select += `${a} `));
      populates.push({ path: as || labelCases(label).CP, select });
    });
    return populates;
  };

  entities = setEnums(Object.entries(models).flatMap((m: any) => m[0]));
}
