import { v4 as uuidv4 } from "uuid";
import { getEntityProperties, filterAttrs } from "../../utils";
import boom from "@hapi/boom";

export class Post {
  uuid: string;
  userUUID: string;
  title: string;
  content: string;
  createdAt: number = 0;
  updatedAt: number = 0;

  constructor({
    uuid,
    userUUID,
    title,
    content,
    createdAt,
    updatedAt,
  }: {
    uuid: string;
    userUUID: string;
    title: string;
    content: string;
    createdAt: number;
    updatedAt: number;
  }) {
    this.uuid = uuid;
    this.userUUID = userUUID;
    this.title = title;
    this.content = content;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
  static create = async (DatabaseServices: any, data: any): Promise<any> => {
    DatabaseServices.setupModel("Post");
    const exist = await DatabaseServices.findOne(data);
    console.log({ exist });
    if (exist) throw boom.conflict("Entity exist yet!");

    const uuid = uuidv4();
    const account = new Post({
      ...data,
      uuid,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    });
    await DatabaseServices.create({
      ...getEntityProperties(account),
    });
    return account;
  };

  static load = async (DatabaseServices: any, credentials: any) => {
    DatabaseServices.setupModel("Post");
    const user = await Post.find(DatabaseServices, { uuid: credentials.uuid });
    if (!user) throw boom.notFound("Incorrect credentials!");
    const account = new Post(user);
    return account;
  };

  static find = async (DatabaseServices: any, credentials: any) => {
    DatabaseServices.setupModel("Post");
    const account: any = await DatabaseServices.findOne({
      ...filterAttrs(
        getEntityProperties(credentials),
        ["title", "userUUID"],
        false
      ),
    });
    return account;
  };

  remove = async (DatabaseServices: any) => {
    DatabaseServices.setupModel("Post");
    return await DatabaseServices.remove(getEntityProperties(this));
  };

  update = async (DatabaseServices: any, data: any) => {
    DatabaseServices.setupModel("Post");
    this.updatedAt = new Date().getTime();
    return await DatabaseServices.update({
      ...getEntityProperties({ ...this, ...data }),
    });
  };
}
