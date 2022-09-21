import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { getEntityProperties, filterAttrs } from "../../utils";
import boom from "@hapi/boom"

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
  static create = async (DatabaseServices: any, data: any): Promise<any> => {
    DatabaseServices.setupModel("User")
    const exist = await DatabaseServices.findOne({
      ...filterAttrs(data, ["email", "username"], false),
    })
    console.log({exist})
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
    await DatabaseServices.create({
      ...getEntityProperties(account),
    });
    return account;
  };

  static load = async (DatabaseServices: any, credentials: any) => {
    DatabaseServices.setupModel("User")
    const user = await User.find(
      DatabaseServices,
      filterAttrs(credentials, ["email", "username"], false)
    );
    if (!user) throw boom.notFound("Incorrect credentials!");
    const account = new User(user);
    return account;
  };

  static find = async (DatabaseServices: any, credentials: any) => {
    DatabaseServices.setupModel("User")
    const account: any = await DatabaseServices.findOne({
      ...filterAttrs(
        getEntityProperties(credentials),
        ["email", "username"],
        false
      ),
    });
    return account;
  };

  remove = async (DatabaseServices: any) => {
    DatabaseServices.setupModel("User")
    return await DatabaseServices.remove({
      ...filterAttrs(getEntityProperties(this), ["email", "name"], false),
    });
  };

  update = async (DatabaseServices: any, data:any) => {
    DatabaseServices.setupModel("User")
    this.updatedAt = new Date().getTime();
    return await DatabaseServices.update({
      ...getEntityProperties({...this, ...data}),
    });
  };

  hashPassword = async (password: string | undefined) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password || this.password, salt);
    this.password = hash;
    return hash;
  };

  comparePassword = async (password: string): Promise<Boolean> => {
    return await bcrypt.compare(password, this.password);
  };
}
