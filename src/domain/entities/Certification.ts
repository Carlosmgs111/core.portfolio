import { v4 as uuidv4 } from "uuid";
import { getEntityProperties, filterAttrs } from "../../utils";

export class Certification {
  uuid: string = "";
  title: string = "";
  institutionUUID: string = ""; // * ID to institution
  emitedAt: number = 0; // * timestamp
  image: string = ""; // * url to image
  url: string = ""; // * url to certificated course or institution
  tags: string[];
  createdAt: number = 0;
  updatedAt: number = 0;

  constructor({ uuid, title, institutionUUID, emitedAt, image, url, tags }: any) {
    this.uuid = uuid;
    this.title = title;
    this.institutionUUID = institutionUUID;
    this.emitedAt = emitedAt;
    this.image = image;
    this.url = url;
    this.tags = tags;
    this.createdAt = new Date().getTime();
    this.updatedAt = new Date().getTime();
  }
  static create = async (
    DatabaseServices: any,
    data: any
  ): Promise<Certification> => {
    DatabaseServices.setupModel("Certification");
    const uuid = uuidv4();
    const certification = new Certification({ ...data, uuid });
    await DatabaseServices.create(certification);
    return certification;
  };

  static load = async (DatabaseServices: any, credentials: any) => {
    DatabaseServices.setupModel("Certification");
    const project = await Certification.find(DatabaseServices, credentials);
    if (!project) throw new Error("Incorrect credentials!");
    const certificate = new Certification(project);
    return certificate;
  };

  static find = async (DatabaseServices: any, credentials: any) => {
    DatabaseServices.setupModel("Certification");
    const certificate: any = await DatabaseServices.findOne(credentials)
    ;
    return certificate;
  };

  static findAll = async (DatabaseServices: any, credentials: any) => {
    DatabaseServices.setupModel("Certification");
    console.log({credentials})
    const certificate: any = await DatabaseServices.findAll(
      credentials
    );
    return certificate;
  };

  remove = async (DatabaseServices: any) => {
    DatabaseServices.setupModel("Certification");
    return await DatabaseServices.remove({
      ...filterAttrs(
        getEntityProperties(this),
        ["businessName", "title", "uuid"],
        false
      ),
    });
  };

  update = async (DatabaseServices: any, data:any) => {
    DatabaseServices.setupModel("Certification");
    this.updatedAt = new Date().getTime();
    return await DatabaseServices.update({
      ...getEntityProperties({...this, ...data}),
    });
  };
}
