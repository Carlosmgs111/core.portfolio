import { DatabaseService } from "../services/DatabaseServices";
import { User } from "../../domain/entities/User";

const DBService = new DatabaseService({__identifier: "User"});

export const registerUser = async (data: any) => {
  return await User.create(DBService, data);
};
export const signin = async (data: any) => {
  return await User.load(DBService, data);
};
export const removeUser = async (data: any) => {
  const user = await User.load(DBService, data);
  return await user.remove(DBService);
};
export const updateUser = async (data: any) => {
  console.log({ data });
  const user = await User.load(DBService, data);
  user.privilege = data.privilege;
  return await user.update(DBService);
};
