import { v4 as uuidv4 } from "uuid";
import { getEntityProperties, filterAttrs } from "../../utils";
import boom from "@hapi/boom";

export class Post {
  uuid: string;
  title: string;
  content: string;
  createdAt: number = 0;
  updatedAt: number = 0;

  constructor({
    uuid,
    title,
    content,
    createdAt,
    updatedAt,
  }: {
    uuid: string;
    title: string;
    content: string;
    createdAt: number;
    updatedAt: number;
  }) {
    this.uuid = uuid;
    this.title = title;
    this.content = content;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
  static create = async (DatabaseServices: any, data: any): Promise<any> => {
    const exist = await DatabaseServices.findOne(
      DatabaseServices.entities.Post,
      {
        credentials: filterAttrs(data, ["token", "user"]),
      }
    );
    console.log({ exist });
    if (exist) throw boom.conflict("Entity exist yet!");

    const uuid = uuidv4();
    const post = await DatabaseServices.relate2One(
      new Post({
        ...data,
        uuid,
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
      }),
      [{ user: { uuid: data.user.uuid } }]
    );
    await DatabaseServices.create({
      ...getEntityProperties(post),
    });
    return post;
  };

  static load = async (DatabaseServices: any, credentials: any) => {
    const user = await Post.find(DatabaseServices, { uuid: credentials.uuid });
    if (!user) throw boom.notFound("Incorrect credentials!");
    const account = new Post(user);
    return account;
  };

  static find = async (DatabaseServices: any, credentials: any) => {
    const account: any = await DatabaseServices.findOne(
      DatabaseServices.entities.Post,
      {
        credentials: filterAttrs(
          getEntityProperties(credentials),
          ["title", "userUUID"],
          false
        ),
      }
    );
    return account;
  };

  remove = async (DatabaseServices: any) => {
    return await DatabaseServices.remove(DatabaseServices.entities.Post, {
      credentials: { uuid: this.uuid },
    });
  };

  update = async (DatabaseServices: any, data: any) => {
    this.updatedAt = new Date().getTime();
    return await DatabaseServices.update(
      DatabaseServices.entities.Post,
      {
        ...getEntityProperties({ ...this, ...data }),
      },
      { credentials: { uuid: this.uuid } }
    );
  };
}
