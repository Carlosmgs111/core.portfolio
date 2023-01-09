import { DatabaseService, Adapters } from "../DatabaseServices";
console.log({ DatabaseService });

export const QueryService = DatabaseService(Adapters.MongooseAdapter);
export const CommandService = DatabaseService(Adapters.SequelizeAdapter);

export const RepositoryService = {
  create: CommandService.create,
  createMany: CommandService.createMany,
  findOne: QueryService.findOne,
  findAll: QueryService.findAll,
  remove: CommandService.remove,
  update: CommandService.update,
  relateN2N: CommandService.relateN2N,
  relate2One: CommandService.relate2One,
  unrelateN2N: CommandService.unrelateN2N,
  checkRelationship: CommandService.checkRelationship,
  entities: {...CommandService.entities, ...QueryService.entities},
  setupEntity: CommandService.setupEntity,
  info: () => {
    return "Repository Service";
  },
};
