import { DatabaseService, Adapters } from "../DatabaseServices";
console.log({ DatabaseService });

export const QueryService = DatabaseService(Adapters.MongooseAdapter);
export const CommandService = DatabaseService(Adapters.SequelizeAdapter);

export const RepositoryService = {
  query: QueryService,
  command: CommandService,
  info: () => {
    return "Repository Service";
  },
};
