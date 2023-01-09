import { Query } from "pg";
import { DatabaseService, Adapters } from "../DatabaseServices";
console.log({ DatabaseService });

export const QueryService = DatabaseService(Adapters.MongooseAdapter);
export const CommandService = DatabaseService(Adapters.SequelizeAdapter);

export const RepositoryService = {
  create: async (entity: any, Entity: any, options: any = {}) => {
    QueryService.create(entity, Entity, options);
    return await CommandService.create(entity, Entity, options);
  },
  createMany: async (entity: any, entities: any, options: any = {}) => {
    console.log({
      query: await QueryService.createMany(entity, entities, options),
    });
    return await CommandService.createMany(entity, entities, options);
  },
  findOne: async (entity: any, options: any = {}) => {
    return await QueryService.findOne(entity, options);
  },
  findAll: async (entity: any, options: any = {}) => {
    return await QueryService.findAll(entity, options);
  },
  remove: async (entity: any, options: any) => {
    QueryService.remove(entity, options);
    return await CommandService.remove(entity, options);
  },
  update: async (entity: any, Entity: any, options: any = {}) => {
    QueryService.update(entity, Entity, options);
    return await CommandService.update(entity, Entity, options);
  },
  relateN2N: async (refs: any) => {
    QueryService.relateN2N(refs);
    return await CommandService.relateN2N(refs);
  },
  relate2One: async (entity: any, refs: any) => {
    QueryService.relate2One(entity, refs);
    return await CommandService.relate2One(entity, refs);
  },
  unrelateN2N: async (refs: any) => {
    QueryService.unrelateN2N(refs);
    return await CommandService.unrelateN2N(refs);
  },
  checkRelationship: CommandService.checkRelationship,
  entities: { ...CommandService.entities, ...QueryService.entities },
  setupEntity: CommandService.setupEntity,
  info: () => {
    return "Repository Service";
  },
};
