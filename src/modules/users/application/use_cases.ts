import { User } from "../domain/entity";
import config from "../../../config";

export const registerUser = async (
  RepositoryService: any,
  bcrypt: any,
  data: any
) => {
  return await User.create(RepositoryService, data, bcrypt);
};
export const removeUser = async (
  RepositoryService: any,
  bcrypt: any,
  data: any
) => {
  const user = await User.authLoad(RepositoryService, data, bcrypt);
  return await user.remove(RepositoryService);
};
export const updateUser = async (
  RepositoryService: any,
  bcrypt: any,
  data: any
) => {
  return await (
    await User.authLoad(RepositoryService, data, bcrypt)
  ).update(RepositoryService, data);
};
export const sayHello = (data: any) => data.user.sayHello(data.name);

export const getAllUsername = async (RepositoryService: any) =>
  (await User.findAll(RepositoryService)).map((u: any) => u.username);

export const load = async (RepositoryService: any, indexation: any) =>
  await User.load(RepositoryService, { indexation });

export const changeUsername = async (
  RepositoryService: any,
  credentials: any
) => {
  const { user, newUsername } = credentials;
  await user.update(RepositoryService, { username: newUsername });
};

export const updateAvatar = async (
  RepositoryService: any,
  credentials: any
) => {
  const { newAvatar, user } = credentials;
  await user.update(RepositoryService, { avatar: newAvatar });
};
/*  */
const entities: any = { User };

export const findBy = async (RepositoryService: any, findBy: any) => {
  // ({ findBy });
  return await User.find(RepositoryService, { indexation: findBy });
};

export const createOne = async (
  RepositoryService: any,
  label: string,
  args: any
) => {
  return await entities[label].new(RepositoryService, args);
};
/*  */
export const update = async (
  RepositoryService: any,
  bcrypt: any,
  credentials: any,
  data: any
) => {
  RepositoryService;
  const account = await User.authLoad(RepositoryService, credentials, bcrypt);
  if (account) await account.update(RepositoryService, data);
};

export const resetPassword = async (
  RepositoryService: any,
  credentials: any
) => {
  const { oldPassword, newPassword, username, token, user } = credentials;
  const result = await user.changePassword(RepositoryService, {
    newPassword,
    oldPassword,
  });
  return { changed: result };
};

export const contactByEmail = async (MailerService: any, ctx: any) => {
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
