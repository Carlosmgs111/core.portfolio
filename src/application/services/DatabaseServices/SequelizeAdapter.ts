import models from "../../../infrastructure/repositories/sequelize/src/models";
import { labelCases, Mapfy, setEnums } from "../../../utils";
import { v4 as uuidv4 } from "uuid";
import boom from "@hapi/boom";

export default class SequelizeAdapter {
  serviceDescription: string = "Sequelize Database Service Adapter";
  Entity: any;

  // ! Assingment of table in DDBB by use of '__identifier' parameter deprecated, use setModel instead
  constructor({}: any) {
    this.syncModels();
  }

  createOne = async (
    entity: any,
    Entity: any,
    options: any = {}
  ): Promise<typeof Entity | null> => {
    const newEntity = await models[entity].create(
      Entity,
      this.adapter(options)
    );
    return newEntity.dataValues;
  };

  createMany = async (entity: any, entities: any, options: any = {}) => {
    const entitiesCreated = await models[entity].bulkCreate(
      entities,
      this.adapter(options)
    );
    return entitiesCreated.map((e: any) => ({ ...e.dataValues }));
  };

  findAll = async (entity: any, options: any = {}) => {
    const entities = await models[entity].findAll(this.adapter(options));
    return entities.map((e: any) => ({ ...e.dataValues }));
  };

  findOne = async (entity: any, options: any = {}) => {
    try {
      const entityFounded = await models[entity].findOne(this.adapter(options));
      if (!entityFounded) return null;
      return entityFounded.dataValues;
    } catch (e: any) {
      console.log(e.message.red);
      throw boom.internal(e.message);
    }
  };

  removeOne = async (entity: any, options: any) => {
    if (!options.credentials)
      throw boom.forbidden(
        "Must supply credentials for find and delete entity!"
      );
    return await models[entity].destroy(this.adapter(options));
  };

  updateOne = async (entity: any, Entity: any, options: any = {}) => {
    const updated = await models[entity].update(Entity, this.adapter(options));
    return updated.dataValues;
  };

  createOneRelationshipN2N = async (refs: any) => {
    let succesfully = false;
    for (let ref of refs) {
      const [from, to] = ref;
      const [exist, data, relationshipLabel]: any =
        await this.checkOneRelationshipN2N(from, to);
      if (exist) throw boom.conflict("Entity exist yet!");
      const newSupportEntity = await this.createOne(relationshipLabel, {
        ...data,
        uuid: uuidv4(),
      });
      if (!newSupportEntity)
        throw boom.conflict("Support table doesn't created");
    }
    return succesfully;
  };

  // TODO rename to removeRelationship
  removeOneRelationshipN2N = async (refs: any) => {
    for (let ref of refs) {
      const [from, to] = ref;
      const [exist, data, relationshipLabel] = await this.checkOneRelationshipN2N(
        from,
        to
      );
      if (!exist) throw boom.conflict("Relationship doesn't exist!");
      return await this.removeOne(relationshipLabel, { credentials: data });
    }
  };

  createOneRelationship2One = async (entity: any, refs: any) => {
    const relations2One: any = {};
    for (let ref of refs) {
      const key = Mapfy(ref).keys().next().value;
      const value = Mapfy(ref).values().next().value;
      // console.log({ key, value });
      const referenced = await models[labelCases(key).CS].findOne({
        where: value,
      });
      relations2One[`${key}UUID`] = referenced.uuid;
    }

    const key = Mapfy(entity).keys().next().value;
    const value = Mapfy(entity).values().next().value;
    // console.log({ relations2One });
    // console.log({ key, value });
    models[labelCases(key).CS].update(relations2One, { where: value });
    return { ...entity, ...relations2One };
  };

  // ? Pending to test
  removeOneRelationship2One = async (entity: any, refs: any) => {
    const relations2One: any = {};
    for (let ref of refs) {
      relations2One[`${ref}UUID`] = null;
    }
    return { ...entity, ...relations2One };
  };

  checkOneRelationshipN2N = async (from: any, to: any) => {
    const composeRelationshipLabel = (from: string, to: string) => {
      if (models[`${labelCases(from).CP}_${labelCases(to).CP}`])
        return `${labelCases(from).CP}_${labelCases(to).CP}`;
      if (models[`${labelCases(to).CP}_${labelCases(from).CP}`])
        return `${labelCases(to).CP}_${labelCases(from).CP}`;
      throw boom.internal("Invalid labels");
    };
    let relationshipLabel: string = composeRelationshipLabel(
      from.label,
      to.label
    );
    const relationshipUUIDS = {
      [`${from.label}UUID`]: from.pk,
      [`${to.label}UUID`]: to.pk,
    };
    const exist = await this.findOne(relationshipLabel, {
      credentials: relationshipUUIDS,
    });
    return [exist, relationshipUUIDS, relationshipLabel];
  };

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
      include: this.formatIncludeClosure(related),
      limit: Number(size),
      offset: Number(page),
      alias: as,
    };
  };

  // ? pending to find an appropiated agnosthic name
  formatIncludeClosure(entitiesToInclude: any = []) {
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

  setupEntity(entityLabel: string) {
    this.Entity = models[entityLabel];
    return this;
  }

  // * A function that is called in the constructor of the class. It is used to associate the models in
  // * the database.
  syncModels = () => {
    for (var model in models)
      models[model].associate && models[model].associate(models);
  };

  entities = setEnums(Object.entries(models).flatMap((m: any) => m[0]));
}
