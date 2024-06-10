import { User } from "./entity";
import { RepositoryService, MailerService } from "../../config/dependencies";
import config from "../../config";

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

export const contactByEmail = async (ctx: any) => {
  const { who, email, message } = ctx;
  const composedHtmlMessage = `
  <h3>${who}</h3>
  <a href="mailto:${email}
    ?subject=Hola ${who}
    &body=Hola ${who}, gracias por contactarte conmigo">
    <h4>${email}</h4>
  </a>
  <p>${message}</p>
  `;
  const result = await MailerService.sendMail({
    to: [config.contactEmailAddress, config.mailerEmailAddress],
    html: composedHtmlMessage,
    subject: `Te han contacto por parte de ${who}`,
  });
  return result;
};
