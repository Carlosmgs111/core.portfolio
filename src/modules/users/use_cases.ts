import { User } from "./entity";
import { RepositoryService, AuthServices } from "../../config/dependencies";
import { filterAttrs, encryptData, decryptData } from "../../utils";
import config from "../../config";
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

export const getAllUsername = async () =>
  (await User.findAll(RepositoryService)).map((u: any) => u.username);

export const load = async (credentials: any) =>
  await User.load(RepositoryService, { credentials });

export const changeUsername = async (credentials: any) => {
  const { user, newUsername } = credentials;
  console.log({ user, newUsername });
  await user.update(RepositoryService, { username: newUsername });
};

export const updateAvatar = async (credentials: any) => {
  const { newAvatar, user } = credentials;
  await user.update(RepositoryService, { avatar: newAvatar });
};

/*  */

const entities: any = { User };

export const findBy = async (label: string, findBy: any) => {
  // console.log({ findBy });
  return await entities[label].find(RepositoryService, { credentials: findBy });
};

export const createOne = async (label: string, args: any) => {
  return await entities[label].new(RepositoryService, args);
};

export const signup = async (credentials: any) => {
  const { username, email, password } = credentials;
  if (email)
    console.log(
      "Authentication Signup use case must be implemented! ".bgYellow
    );
  return await User.create(RepositoryService, credentials);
};

// * this is the exposed to routes
export const login = async (credentials: any) => {
  const account = await User.authLoad(RepositoryService, {
    credentials,
    // related: [["Institution"], ["Certification"]],
  });
  if (!account) throw new Error("The account doesn't exist!");
  let response = AuthServices.getAuthPackage(
    filterAttrs(
      account,
      ["uuid", "email", "username", "privilege", "createdAt", "avatar"],
      false
    )
  );
  return response;
};

export const authSignin = async (credentials: any) => {
  RepositoryService;
  const entity = await User.authLoad(RepositoryService, credentials);
  if (!entity) throw new Error("The account doesn't exist!");
  const isMatch = entity.comparePassword(credentials.password);
  if (!isMatch) throw new Error("The account doesn't exist!");
  return entity;
};

export const unsubscribe = async (credentials: any) => {
  RepositoryService;
  const account = await User.authLoad(RepositoryService, credentials);
  if (account) await account.remove(RepositoryService);
};

export const update = async (credentials: any, data: any) => {
  RepositoryService;
  const account = await User.authLoad(RepositoryService, credentials);
  if (account) await account.update(RepositoryService, data);
};

// ! possible vulnerability detected!
export const resetAuthPassword = async (credentials: any) => {
  RepositoryService;
  const { token } = credentials;
  console.log({ token });
  const { email, cipheredPassword } = AuthServices.verifyKey(token);
  const newPassword = decryptData(
    cipheredPassword,
    config.jwtSignupSecret || ""
  );
  const account = await User.authLoad(RepositoryService, {
    credentials: { email },
  });
  const oldPassword = account.password;
  account.changePassword(RepositoryService, { newPassword, oldPassword }); // ! check this method
  return "OK";
};

export const resetPassword = async (credentials: any) => {
  const { oldPassword, newPassword, username, token, user } = credentials;
  console.log({ user });
  const result = await user.changePassword(RepositoryService, {
    newPassword,
    oldPassword,
  });
  return { changed: result };
};
