import { User } from "../domain/User";
import { RepositoryService } from "../../../config/dependencies";

const entities: any = { User };

export const findBy = async (label: string, findBy: any) => {
  // console.log({ findBy });
  return await entities[label].find(RepositoryService, { credentials: findBy });
};

export const createOne = async (label: string, args: any) => {
  return await entities[label].new(RepositoryService, args);
};
