import { User } from "../../domain/entities/User";
import { DatabaseService } from "../services/DatabaseServices";

const entities: any = { User };
const DBService = new DatabaseService({});

export const findBy = async (label: string, findBy: any) => {
  // console.log({ findBy });
  return await entities[label].find(DBService.setup(label), findBy);
};

export const createOne = async (label: string, args: any) => {
  return await entities[label].new(DBService.setup(label), args);
};
