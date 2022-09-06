import { DatabaseService } from "../services/DatabaseServices";
import { User } from "../../domain/entities/User";
// ! implementar el uso de ´boom´ a traves de un ´interface´
import boom from "@hapi/boom";

const DBService = new DatabaseService({ __identifier: "User" });

export const registerUser = async (data: any) => {
  return await User.create(DBService, data);
};
export const signin = async (data: any) => {
  console.log({ data });
  console.log(new Map(Object.entries(data)).has("username" || "email"));
  if (
    !(
      new Map(Object.entries(data)).has("email") ||
      new Map(Object.entries(data)).has("username")
    )
  )
    throw boom.badRequest("Require username or email!");
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
