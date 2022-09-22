import { v4 as uuidv4 } from "uuid";
import { getEntityProperties, filterAttrs } from "../../utils";
import boom from "@hapi/boom"

export class User_Certification {
  uuid: string;
  userUUID: string;
  certificationUUID: string;

  constructor({
    uuid,
    userUUID,
    certificationUUID,
  }: {
    uuid: string;
    userUUID: string;
    certificationUUID: string;
  }) {
    this.uuid = uuid;
    this.userUUID = userUUID;
    this.certificationUUID = certificationUUID;
  }
  static create = async (DatabaseServices: any, data: any): Promise<any> => {
    DatabaseServices.setupModel("Users_Certifications")
    const exist = await DatabaseServices.findOne({
      ...filterAttrs(data, ["certificationUUID", "userUUID"], false),
    })
    console.log({UCExist:exist})
    if (exist) throw boom.conflict("Entity exist yet!");
    
    const uuid = uuidv4();
    const userCertification = new User_Certification({
      ...data,
      uuid,
    });
    console.log({userCertification})
    await DatabaseServices.create(
      userCertification
    );
    return userCertification;
  };

  static load = async (DatabaseServices: any, credentials: any) => {
    DatabaseServices.setupModel("Users_Certifications")
    const user = await User_Certification.find(
      DatabaseServices, credentials
    );
    if (!user) throw boom.notFound("Incorrect credentials!");
    console.log({user})
    const account = new User_Certification(user);
    return account;
  };

  static find = async (DatabaseServices: any, credentials: any) => {
    DatabaseServices.setupModel("Users_Certifications")
    const userCertification: any = await DatabaseServices.findOne(credentials);
    console.log({userCertification})
    return userCertification;
  };

  remove = async (DatabaseServices: any) => {
    DatabaseServices.setupModel("Users_Certifications")
    return await DatabaseServices.remove(getEntityProperties(this)
    );
  };

  update = async (DatabaseServices: any, data:any) => {
    DatabaseServices.setupModel("Users_Certifications")
    return await DatabaseServices.update({
      ...getEntityProperties({...this, ...data}),
    });
  };
}
