import { User } from "../../domain/entities/User";
import { RepositoryService, AuthServices } from "../../config/dependencies";
import { filterAttrs, encryptData, decryptData } from "../../domain/utils";
import config from "../../config";
import { verifyToken2 } from "../../infrastructure/auth/JWT";

export const signup = async (credentials: any) => {
  return await User.create(RepositoryService, credentials);
};

export const signin = async (credentials: any) => {
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
