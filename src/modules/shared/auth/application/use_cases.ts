import { User } from "../../../users/domain/entity";
import config from "../../../../config";
import { filterAttrs, decryptData } from "../../../../utils";

export const login = async (
  RepositoryService: any,
  ChatService: any,
  AuthServices: any,
  bcrypt: any,
  indexation: any
) => {
  const { token, ...rest } = indexation;
  const account = await User.authLoad(
    RepositoryService,
    {
      indexation: rest,
      // related: [["Institution"], ["Certification"]],
    },
    bcrypt
  );
  ChatService.setIsOnline(true);
  if (!account) throw new Error("The account doesn't exist!");
  let response = AuthServices.getAuthPackage({
    ...filterAttrs(
      account,
      ["uuid", "email", "username", "privilege", "createdAt", "avatar"],
      false
    ),
    apiKey: config.apiKey,
  });
  return response;
};

export const logout = async (ChatService: any, credentials?: any) => {
  ChatService.setIsOnline(false);
  return { message: "Logout succesfully!" };
};

export const signup = async (
  RepositoryService: any,
  AuthServices: any,
  bcrypt: any,
  credentials: any
) => {
  const { username, email, password } = credentials;
  if (email) {
    console.log(
      "Authentication Signup use case must be implemented! ".bgYellow
    );
  }
  const account = await User.create(RepositoryService, credentials, bcrypt);
  let response = AuthServices.getAuthPackage({
    ...filterAttrs(
      account,
      ["uuid", "email", "username", "privilege", "createdAt", "avatar"],
      false
    ),
    apiKey: config.apiKey,
  });
  return response;
};

export const checkIfIsOnline = (ChatService: any) => ChatService.getIsOnline();

export const unsubscribe = async (
  RepositoryService: any,
  bcrypt: any,
  credentials: any
) => {
  const account = await User.authLoad(RepositoryService, credentials, bcrypt);
  if (account) await account.remove(RepositoryService);
};

export const authSignin = async (
  RepositoryService: any,
  bcrypt: any,
  credentials: any
) => {
  RepositoryService;
  const entity = await User.authLoad(RepositoryService, credentials, bcrypt);
  if (!entity) throw new Error("The account doesn't exist!");
  const isMatch = entity.comparePassword(credentials.password, bcrypt);
  if (!isMatch) throw new Error("The account doesn't exist!");
  return entity;
};

export const signin = async (
  RepositoryService: any,
  bcrypt: any,
  data: any
) => {
  if (
    !(
      new Map(Object.entries(data)).has("email") ||
      new Map(Object.entries(data)).has("username")
    )
  )
    throw new Error("Require username or email!");
  return await User.authLoad(RepositoryService, { credentials: data }, bcrypt);
};

// ! possible vulnerability detected!
export const resetAuthPassword = async (
  RepositoryService: any,
  AuthServices: any,
  bcrypt: any,
  credentials: any
) => {
  RepositoryService;
  const { token } = credentials;
  ({ token });
  const { email, cipheredPassword } = AuthServices.verifyKey(token);
  const newPassword = decryptData(
    cipheredPassword,
    config.jwtSignupSecret || ""
  );
  const account = await User.authLoad(
    RepositoryService,
    {
      credentials: { email },
    },
    bcrypt
  );
  const oldPassword = account.password;
  account.changePassword(
    RepositoryService,
    { newPassword, oldPassword },
    bcrypt
  ); // ! check this method
  return "OK";
};
