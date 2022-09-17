import { User } from "../../domain/entities/User";
import { DatabaseService, AuthServices } from "../services";
import { filterAttrs, encryptData, decryptData } from "../../domain/utils";
import config from "../../config";

const DBS = new DatabaseService({ __identifier: "User" });
const AUTHS = new AuthServices();

export const signup = async (credentials: any) => {
  const { password, username, email } = credentials;
  const existAccount = await User.find(DBS, { email });
  console.log({ existAccount });
  return await User.create(DBS, { email, password, username });
};

export const signin = async (credentials: any) => {
  const account = await User.load(DBS, credentials);
  if (!account) throw new Error("The account doesn't exist!");
  // const isMatch = await account.comparePassword(credentials.password);
  // if (!isMatch) throw new Error("Email or password are incorrect");
  let response = AUTHS.getAuthPackage(
    filterAttrs(account, ["uuid", "email"], false)
  );
  return response;
};

export const authSignin = async (credentials: any) => {
  const entity = await User.load(DBS, credentials);
  // console.log({ entity });
  if (!entity) throw new Error("The account doesn't exist!");
  const isMatch = entity.comparePassword(credentials.password);
  if (!isMatch) throw new Error("The account doesn't exist!");
  return entity;
};

export const unsubscribe = async (credentials: any) => {
  const account = await User.load(DBS, credentials);
  if (account) await account.remove(DBS);
};

export const update = async (credentials: any) => {
  const account = await User.load(DBS, credentials);
  if (account) await account.update(DBS);
};

// ! possible vulnerability detected!
export const resetPassword = async (credentials: any) => {
  const { token } = credentials;
  console.log({ token });
  const { email, cipheredPassword } = AUTHS.verifyKey(token);
  const newPassword = decryptData(cipheredPassword, config.jwtSignupSecret);
  const account = await User.load(DBS, { email });
  const oldPassword = account.password;
  // account.changePassword({ newPassword, oldPassword }); // ! check this method
};
