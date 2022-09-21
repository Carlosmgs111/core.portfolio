import { User } from "../../domain/entities/User";
import {DatabaseService} from "../../config/dependencies"
// ! implementar el uso de ´boom´ a traves de un ´interface´
import boom from "@hapi/boom";

export const registerUser = async (data: any) => {
  return await User.create(DatabaseService, data);
};
export const signin = async (data: any) => {
  if (
    !(
      new Map(Object.entries(data)).has("email") ||
      new Map(Object.entries(data)).has("username")
    )
  )
    throw boom.badRequest("Require username or email!");
  return await User.load(DatabaseService, data);
};
export const removeUser = async (data: any) => {
  const user = await User.load(DatabaseService, data);
  return await user.remove(DatabaseService);
};
export const updateUser = async (data: any) => {
  console.log({ data });
  const user = await User.load(DatabaseService, data);
  user.privilege = data.privilege;
  return await user.update(DatabaseService);
};

export const sayHello = (data: any) => data.user.sayHello(data.name);
