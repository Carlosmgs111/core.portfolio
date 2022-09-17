import { v4 as uuidv4 } from "uuid";
import { getEntityProperties, filterAttrs } from "../../utils";

export class Certification {
  uuid: string = "";
  title: string = "";
  certificatedTo: string = ""; // * ID to user
  emitedBy: string = ""; // * ID to institution
  emitedAt: number = 0; // * timestamp
  image: string = ""; // * url to image
  url: string = ""; // * url to certificated course or institution
  createdAt: number = 0;
  updatedAt: number = 0;
  
  constructor({
    uuid,
    title,
    certificatedTo,
    emitedBy,
    emitedAt,
    image,
    url,
  }: any) {
    this.uuid = uuid;
    this.title = title;
    this.certificatedTo = certificatedTo;
    this.emitedBy = emitedBy;
    this.emitedAt = emitedAt;
    this.image = image;
    this.url = url;
    this.createdAt = new Date().getTime();
    this.updatedAt = new Date().getTime();
  }
  static create = async (
    DatabaseServices: any,
    data: any
  ): Promise<Certification> => {
    const uuid = uuidv4();
    const certification = new Certification({ ...data, uuid });
    console.log({certification})
    await DatabaseServices.create(certification);
    return certification;
  };

  static load = async (DatabaseServices: any, credentials: any) => {
    const project = await Certification.find(DatabaseServices, credentials);
    if (!project) throw new Error("Incorrect credentials!");
    const certificate = new Certification(project);
    return certificate;
  };

  static find = async (DatabaseServices: any, credentials: any) => {
    const certificate: any = await DatabaseServices.findOne({
      ...filterAttrs(
        getEntityProperties(credentials),
        ["businessName", "title", "uuid"],
        false
      ),
    });
    return certificate;
  };

  static findAll = async (DatabaseServices: any, credentials: any) => {
    const certificate: any = await DatabaseServices.findAll({
      ...filterAttrs(
        getEntityProperties(credentials),
        ["businessName", "title", "uuid"],
        false
      ),
    });
    return certificate;
  };

  remove = async (DatabaseServices: any) => {
    return await DatabaseServices.remove({
      ...filterAttrs(
        getEntityProperties(this),
        ["businessName", "title", "uuid"],
        false
      ),
    });
  };

  update = async (DatabaseServices: any) => {
    return await DatabaseServices.update({
      ...getEntityProperties(this),
    });
  };
}
