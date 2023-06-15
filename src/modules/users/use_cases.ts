import { User } from "./entity";
import { RepositoryService } from "../../config/dependencies";

export const registerUser = async (data: any) => {
  return await User.create(RepositoryService, data);
};
export const removeUser = async (data: any) => {
  const user = await User.authLoad(RepositoryService, data);
  return await user.remove(RepositoryService);
};
export const updateUser = async (data: any) => {
  return await (
    await User.authLoad(RepositoryService, data)
  ).update(RepositoryService, data);
};
export const sayHello = (data: any) => data.user.sayHello(data.name);

export const getAllUsername = async () =>
  (await User.findAll(RepositoryService)).map((u: any) => u.username);

export const load = async (credentials: any) =>
  await User.load(RepositoryService, { credentials });

export const changeUsername = async (credentials: any) => {
  const { user, newUsername } = credentials;
  ({ user, newUsername });
  await user.update(RepositoryService, { username: newUsername });
};

export const updateAvatar = async (credentials: any) => {
  const { newAvatar, user } = credentials;
  await user.update(RepositoryService, { avatar: newAvatar });
};
/*  */
const entities: any = { User };

export const findBy = async (label: string, findBy: any) => {
  // ({ findBy });
  return await entities[label].find(RepositoryService, { credentials: findBy });
};

export const createOne = async (label: string, args: any) => {
  return await entities[label].new(RepositoryService, args);
};
/*  */
export const update = async (credentials: any, data: any) => {
  RepositoryService;
  const account = await User.authLoad(RepositoryService, credentials);
  if (account) await account.update(RepositoryService, data);
};

export const resetPassword = async (credentials: any) => {
  const { oldPassword, newPassword, username, token, user } = credentials;
  const result = await user.changePassword(RepositoryService, {
    newPassword,
    oldPassword,
  });
  return { changed: result };
};
