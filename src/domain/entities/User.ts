import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { getEntityProperties, filterAttrs } from "../../utils";
import boom from "@hapi/boom";

export class User {
  uuid: string;
  username: string;
  email: string;
  password: string;
  privilege: string;
  createdAt: number = 0;
  updatedAt: number = 0;

  constructor({
    uuid,
    username,
    email,
    password,
    privilege,
    createdAt,
    updatedAt,
  }: {
    uuid: string;
    username: string;
    email: string;
    password: string;
    privilege: string;
    createdAt: number;
    updatedAt: number;
  }) {
    this.uuid = uuid;
    this.username = username;
    this.email = email;
    this.password = password;
    this.privilege = privilege;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create = async (RepositoryService: any, data: any): Promise<any> => {
    const exist = await RepositoryService.findOne(
      RepositoryService.entities.User,
      {
        credentials: filterAttrs(
          getEntityProperties(data),
          ["email", "username"],
          false
        ),
      }
    );
    if (exist) throw boom.conflict("Entity exist yet!");
    const uuid = uuidv4();
    const account = new User({
      ...data,
      uuid,
      privilege: "admin",
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    });
    await account.hashPassword(account.password);
    await RepositoryService.createOne({
      ...getEntityProperties(account),
    });
    return account;
  };

  static load = async (RepositoryService: any, options: any = {}) => {
    const user = await User.find(RepositoryService, options);
    if (!user) throw boom.notFound("Incorrect credentials!");
    const account = new User(user);
    return account;
  };

  static find = async (RepositoryService: any, options: any = {}) => {
    const account: any = await RepositoryService.findOne(
      RepositoryService.entities.User,
      {
        ...options,
        credentials: filterAttrs(
          getEntityProperties(options.credentials),
          ["email", "username"],
          false
        ),
      }
    );
    if (!account) throw boom.conflict("Account doesn´t exist!");
    return account;
  };

  static findAll = async (DatabaseService: any, options: any = {}) =>
    (await DatabaseService.findAll(DatabaseService.entities.User, options)).map(
      (user: any) => user.dataValues.username
    );

  remove = async (RepositoryService: any) => {
    return await RepositoryService.removeOne(RepositoryService.entities.User, {
      credentials: { uuid: this.uuid },
    });
  };

  update = async (RepositoryService: any, data: any) => {
    this.updatedAt = new Date().getTime();
    return await RepositoryService.updateOne(
      RepositoryService.entities.User,
      {
        ...getEntityProperties({ ...this, ...data }),
      },
      { credentials: { uuid: this.uuid } }
    );
  };

  static certifications = async (RepositoryService: any, credentials: any) => {
    const user: any = await User.find(RepositoryService, {
      credentials,
      related: [["Certification"]],
    });
    return user.Certifications.map((c: any) =>
      filterAttrs(
        {
          ...(c.dataValues ? c.dataValues : c._doc),
          grantedTo: user.username,
        },
        ["Users_Certifications"]
      )
    );
  };

  static projects = async (RepositoryService: any, credentials: any) => {
    const user = await User.find(RepositoryService, {
      credentials,
      related: [["Project"]],
    });
    return user.Projects;
  };

  hashPassword = async (password: string | undefined) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password || this.password, salt);
    this.password = hash;
    return hash;
  };

  comparePassword = async (password: string): Promise<Boolean> =>
    await bcrypt.compare(password, this.password);
}
