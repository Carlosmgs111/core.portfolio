import { User } from "../../domain/entities/User";
import { DatabaseService } from "../../config/dependencies";

const entities: any = { User };

export const findBy = async (label: string, findBy: any) => {
  // console.log({ findBy });
  return await entities[label].find(DatabaseService, { credentials: findBy });
};

export const createOne = async (label: string, args: any) => {
  return await entities[label].new(DatabaseService, args);
};
