import { v4 as uuidv4 } from "uuid";
import { getEntityProperties, filterAttrs } from "../../utils";
import boom from "@hapi/boom";

export class User_Institution {
  uuid: string;
  userUUID: string;
  institutionUUID: string;

  constructor({
    uuid,
    userUUID,
    institutionUUID,
  }: {
    uuid: string;
    userUUID: string;
    institutionUUID: string;
  }) {
    this.uuid = uuid;
    this.userUUID = userUUID;
    this.institutionUUID = institutionUUID;
  }
  static create = async (DatabaseServices: any, data: any): Promise<any> => {
    DatabaseServices.setupModel("Users_Institutions");
    const exist = await DatabaseServices.findOne({
      ...filterAttrs(data, ["institutionUUID", "userUUID"], false),
    });
    console.log({ UIExist: exist });
    if (exist) throw boom.conflict("Entity exist yet!");

    const uuid = uuidv4();
    const userInstitution = new User_Institution({
      ...data,
      uuid,
    });
    console.log({ userInstitution });
    await DatabaseServices.create(userInstitution);
    return userInstitution;
  };

  static load = async (DatabaseServices: any, credentials: any) => {
    DatabaseServices.setupModel("Users_Institutions");
    const user = await User_Institution.find(DatabaseServices, credentials);
    if (!user) throw boom.notFound("Incorrect credentials!");
    console.log({ user });
    const account = new User_Institution(user);
    return account;
  };

  static find = async (DatabaseServices: any, credentials: any) => {
    DatabaseServices.setupModel("Users_Institutions");
    const userInstitution: any = await DatabaseServices.findOne({
      credentials,
    });
    console.log({ userInstitution });
    return userInstitution;
  };

  remove = async (DatabaseServices: any) => {
    DatabaseServices.setupModel("Users_Institutions");
    return await DatabaseServices.remove(getEntityProperties(this));
  };

  update = async (DatabaseServices: any, data: any) => {
    DatabaseServices.setupModel("Users_Institutions");
    return await DatabaseServices.update(
      {
        ...getEntityProperties({ ...this, ...data }),
      },
      { credentials: { uuid: this.uuid } }
    );
  };
}
