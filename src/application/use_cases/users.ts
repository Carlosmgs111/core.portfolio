import { User } from "../../domain/entities/User";
import { RepositoryService } from "../../config/dependencies";
// ! implementar el uso de ´boom´ a traves de un ´interface´
import boom from "@hapi/boom";

export const registerUser = async (data: any) => {
  return await User.create(RepositoryService, data);
};
export const signin = async (data: any) => {
  if (
    !(
      new Map(Object.entries(data)).has("email") ||
      new Map(Object.entries(data)).has("username")
    )
  )
    throw boom.badRequest("Require username or email!");
  return await User.authLoad(RepositoryService, { credentials: data });
};
export const removeUser = async (data: any) => {
  const user = await User.authLoad(RepositoryService, data);
  console.log({ user });
  return await user.remove(RepositoryService);
};
export const updateUser = async (data: any) => {
  console.log({ data });
  return await (
    await User.authLoad(RepositoryService, data)
  ).update(RepositoryService, data);
};
export const sayHello = (data: any) => data.user.sayHello(data.name);

export const getAllUsername = async () => await User.findAll(RepositoryService);

export const load = async (credentials: any) =>
  await User.load(RepositoryService, { credentials });
