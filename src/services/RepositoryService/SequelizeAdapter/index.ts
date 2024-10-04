// import { models } from "../../../config/admin/infrastructure/models";
import config from "../../../config";
import { labelCases, Mapfy, setEnums } from "../../../utils";
import { Model, Sequelize, DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import boom from "@hapi/boom";

interface models {
  [key: string]: any;
}
interface entities {
  [key: string]: string;
}

interface options {
  size?: number;
  page?: number;
  related?: [string];
  indexation?: object;
  orderBy?: {};
}

export default class SequelizeAdapter {
  serviceDescription: string = "Sequelize Database Service Adapter";
  connection: any;
  entities: entities = {};
  models: models = {};
  tableNames: any = {};
  tableSchemas: any = {};

  constructor({}: any = {}) {
    const {
      postgresUserProd,
      postgresPasswordProd,
      postgresHostProd,
      postgresPortProd,
      postgresDatabaseProd,
      postgresDatabaseDev,
      postgresUserDev,
      postgresPasswordDev,
      postgresHostDev,
      postgresPortDev,
      postgresDatabaseTest,
      postgresUserTest,
      postgresPasswordTest,
      postgresHostTest,
      postgresPortTest,
    } = config;

    let ENV = null;
    if (process.argv.includes("DEV")) ENV = "DEV";
    if (process.argv.includes("PROD")) ENV = "PROD";

    let database: string = (() => {
      if (ENV === "DEV") return postgresDatabaseDev;
      if (ENV === "PROD") return postgresDatabaseProd;
      return postgresDatabaseTest;
    })();
    let user: string = (() => {
      if (ENV === "DEV") return postgresUserDev;
      if (ENV === "PROD") return postgresUserProd;
      return postgresUserTest;
    })();
    let PASSWORD: string = (() => {
      if (ENV === "DEV") return encodeURIComponent(postgresPasswordDev);
      if (ENV === "PROD") return encodeURIComponent(postgresPasswordProd);
      return encodeURIComponent(postgresPasswordTest);
    })();
    let host: string = (() => {
      if (ENV === "DEV") return postgresHostDev;
      if (ENV === "PROD") return postgresHostProd;
      return postgresHostTest;
    })();
    let port: number = (() => {
      if (ENV === "DEV") return Number(postgresPortDev);
      if (ENV === "PROD") return Number(postgresPortProd);
      return Number(postgresPortTest);
    })();
    this.connection = new Sequelize(database, user, PASSWORD, {
      host,
      port,
      dialect: "postgres",
      logging: false, //
    });
    // this.syncModels();
  }

  createOne = async (
    entity: any,
    Entity: any,
    options: any = {}
  ): Promise<typeof Entity | null> => {
    const newEntity = await this.models[entity].create(
      Entity,
      this.adapter(options)
    );
    return newEntity.dataValues;
  };

  createMany = async (entity: any, entities: any, options: any = {}) => {
    const entitiesCreated = await this.models[entity].bulkCreate(
      entities,
      this.adapter(options)
    );
    return entitiesCreated.map((e: any) => ({ ...e.dataValues }));
  };

  findAll = async (entity: any, options: any = {}) => {
    const entities = await this.models[entity].findAll(this.adapter(options));
    return entities.map((e: any) => ({ ...e.dataValues }));
  };

  findOne = async (entity: any, options: any = {}) => {
    try {
      const entityFounded = await this.models[entity].findOne(
        this.adapter(options)
      );
      if (!entityFounded) return null;
      return entityFounded.dataValues;
    } catch (e: any) {
      throw boom.internal(e.message);
    }
  };

  removeOne = async (entity: any, options: any) => {
    if (!options.indexation)
      throw boom.forbidden(
        "Must supply indexation for find and delete entity!"
      );
    const result = await this.models[entity].destroy(this.adapter(options));
    if (result) return { deleted: true };
    return { delete: false };
  };

  updateOne = async (entity: any, Entity: any, options: any = {}) => {
    const updated = await this.models[entity].update(
      Entity,
      this.adapter(options)
    );
    return this.getResult(updated);
  };

  setOneRelationship2One = async (entity: any, refs: any) => {
    const mainLabel = Mapfy(entity).keys().next().value;
    const mainQuery = Mapfy(entity).values().next().value;

    const relations2One: any = {};
    for (let ref of refs) {
      const label = Mapfy(ref).keys().next().value;
      const query = Mapfy(ref).values().next().value;
      // ({ label, query });
      const referenced = await this.models[labelCases(label).CS].findOne({
        where: query,
      });
      relations2One[`${label}UUID`] = referenced.uuid;
    }
    this.models[labelCases(mainLabel).CS].update(relations2One, {
      where: mainQuery,
    });
    return { ...entity, ...relations2One };
  };

  // ? Pending to test
  unsetOneRelationship2One = async (entity: any, refs: any) => {
    const relations2One: any = {};
    for (let ref of refs) {
      relations2One[`${ref}UUID`] = null;
    }
    return { ...entity, ...relations2One };
  };

  setOneRelationshipManyToMany = async (refs: any) => {
    let succesfully = false;
    const [from, to] = refs;
    console.log({ from, to });
    const [existed, data, relationshipLabel]: any =
      await this.checkOneRelationshipN2N(from, to);
    if (existed) throw boom.conflict("Entity existed yet!");
    const newSupportEntity = await this.createOne(relationshipLabel, {
      ...data,
      uuid: uuidv4(),
    });
    if (!newSupportEntity) throw boom.conflict("Support table doesn't created");
    return succesfully;
  };

  updateOneRelationshipN2N = async (refs: any) => {
    let succesfully = false;
    for (let ref of refs) {
      const [from, to] = ref;
      const [existed, data, relationshipLabel]: any =
        await this.checkOneRelationshipN2N(from, to);
      if (!existed) throw boom.conflict("Relationship doesn't existed!");
      const updatedEntity = await this.updateOne(relationshipLabel, {
        ...data,
      });
      if (!updatedEntity) throw boom.conflict("Support table doesn't created");
    }
    return succesfully;
  };

  // TODO rename to removeRelationship
  unsetOneRelationshipManyToMany = async (refs: any) => {
    const [from, to] = refs;
    const [existed, data, relationshipLabel] =
      await this.checkOneRelationshipN2N(from, to);
    if (!existed) throw boom.conflict("Relationship doesn't existed!");
    return Boolean(
      await this.removeOne(relationshipLabel, { indexation: data })
    );
  };

  setManyRelationshipsManyToMany = (refsBatch: any) => {
    for (let refs of refsBatch) {
      console.log({ refs });
    }
  };

  checkOneRelationshipN2N = async (from: any, to: any) => {
    const composeRelationshipLabel = (from: string, to: string) => {
      if (this.models[`${labelCases(from).CP}_${labelCases(to).CP}`])
        return `${labelCases(from).CP}_${labelCases(to).CP}`;
      if (this.models[`${labelCases(to).CP}_${labelCases(from).CP}`])
        return `${labelCases(to).CP}_${labelCases(from).CP}`;
      throw boom.internal("Invalid labels");
    };

    const fromLabel = Mapfy(from).keys().next().value;
    const fromQuery = Mapfy(from).values().next().value;
    const toLabel = Mapfy(to).keys().next().value;
    const toQuery = Mapfy(to).values().next().value;

    const { uuid: fromUUID } = await this.models[
      labelCases(fromLabel).CS
    ].findOne({
      where: fromQuery,
      attributes: ["uuid"],
    });
    const { uuid: toUUID } = await this.models[labelCases(toLabel).CS].findOne({
      where: toQuery,
      attributes: ["uuid"],
    });

    let relationshipLabel: string = composeRelationshipLabel(
      fromLabel,
      toLabel
    );
    const relationshipUUIDS = {
      [`${fromLabel}UUID`]: fromUUID,
      [`${toLabel}UUID`]: toUUID,
    };
    const existed = await this.findOne(relationshipLabel, {
      indexation: relationshipUUIDS,
    });
    return [existed, relationshipUUIDS, relationshipLabel];
  };

  private adapter = (OPS: any) => {
    const {
      indexation = {},
      related = [],
      size = 100,
      page = 0,
      as = null,
    }: any = OPS;
    return {
      ...OPS,
      where: indexation,
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
        model: this.models[model],
        as: as || labelCases(model)[singular ? "CS" : "CP"],
        attributes,
        where,
      });
    });
    return include;
  }

  getResult = (result: any) => {
    if (Array.isArray(result))
      return result.map((o: any) => Boolean(o)).includes(true);
  };

  // * A function that is called in the constructor of the class. It is used to associate the models in
  // * the database.
  private syncModels = async () => {
    for (var model in this.models) {
      this.models[model].associate &&
        (await this.models[model].associate(this.models));
    }
  };
  close = async () => {
    await this.connection.close();
  };
  dropAllEntities = async () => {
    await this.connection.sync({ force: true });
  };
  private createJoinTable = (A: any, B: any) => {
    A = A.tableName || A;
    B = B.tableName || B;

    const join_table_name = `${labelCases(A).CP}_${labelCases(B).CP}`;

    const join_table_schema = {
      uuid: {
        primaryKey: true,
        allowNull: false,
        unique: true,
        type: DataTypes.STRING,
      },
      [`${labelCases(A).LS}UUID`]: {
        field: `${labelCases(A).LS}_uuid`,
        unique: false,
        allowNull: false,
        type: DataTypes.STRING,
        references: {
          model: labelCases(A).CP,
          key: "uuid",
          onDelete: "NO ACTION",
          onUpdate: "NO ACTION",
        },
      },
      [`${labelCases(B).LS}UUID`]: {
        field: `${labelCases(B).LS}_uuid`,
        unique: false,
        allowNull: false,
        type: DataTypes.STRING,
        references: {
          model: labelCases(B).CP,
          key: "uuid",
          onDelete: "NO ACTION",
          onUpdate: "NO ACTION",
        },
      },
    };
    this.tableNames[join_table_name] = join_table_name;
    this.tableSchemas[`${labelCases(join_table_name).LP}_schema`] =
      join_table_schema;
    this.models[join_table_name] = this.connection.define(
      join_table_name,
      join_table_schema,
      {
        createdAt: false,
        updatedAt: false,
      }
    );
  };
  addModel = (
    modelName: string,
    model: any,
    model_table: any,
    model_schema: any
  ) => {
    this.models[modelName] = model;
    this.entities = setEnums(
      Object.entries(this.models).flatMap((m: any) => m[0])
    );
    model.init(model_schema, {
      sequelize: this.connection,
      modelName: model_table,
    });
  };
  joinTables = (ATableName: string, bTableName: string) => {
    this.createJoinTable(this.models[ATableName], this.models[bTableName]);
  };
}
