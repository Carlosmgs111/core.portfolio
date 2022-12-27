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

  constructor({
    uuid,
    title,
    institutionUUID,
    emitedAt,
    image,
    url,
    tags,
  }: any) {
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
    const uuid = uuidv4();
    const certification = new Certification({ ...data, uuid });
    await DatabaseServices.setupEntity("Certification").create(certification);
    await DatabaseServices.relate(
      { label: "certification", uuid },
      { label: "user", uuid: data.user.uuid }
    );
    // console.log({ certification })
    return certification;
  };

  static load = async (DatabaseServices: any, credentials: any) => {
    DatabaseServices.setupEntity("Certification");
    const certification = await Certification.find(DatabaseServices, {
      uuid: credentials.uuid,
    });
    if (!certification) throw new Error("Incorrect credentials!");
    const loadedCertification = new Certification(certification);
    return loadedCertification;
  };

  static find = async (DatabaseServices: any, credentials: any) => {
    DatabaseServices.setupEntity("Certification");
    const certificate: any = await DatabaseServices.findOne({ credentials });
    return certificate;
  };

  static findAll = async (DatabaseServices: any, options: any) => {
    DatabaseServices.setupEntity("Certification");
    const certificate: any = await DatabaseServices.findAll(options);
    return certificate;
  };

  remove = async (DatabaseServices: any, options: any) => {
    await DatabaseServices.unrelate(
      { label: "user", uuid: options.userUUID },
      { label: "certification", uuid: this.uuid }
    );
    return await DatabaseServices.setupEntity("Certification").remove({
      credentials: filterAttrs(
        getEntityProperties(this),
        ["businessName", "title", "uuid"],
        false
      ),
    });
  };

  update = async (DatabaseServices: any, data: any) => {
    DatabaseServices.setupEntity("Certification");
    this.updatedAt = new Date().getTime();
    return await DatabaseServices.update(
      {
        ...getEntityProperties({ ...this, ...data }),
      },
      { credentials: { uuid: this.uuid } }
    );
  };
}
