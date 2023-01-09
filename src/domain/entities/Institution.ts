import { v4 as uuidv4 } from "uuid";
type IInstitution = {
  uuid: string;
  name: string;
  businessName: string;
  descriptions: string[];
  urls: [];
};

export class Institution {
  uuid: string = "";
  name: string = "";
  businessName: string = "";
  descriptions: string[] = [];
  urls: string[] = [];
  createdAt: number = 0;
  updatedAt: number = 0;

  constructor({ uuid, name, businessName, descriptions, urls }: IInstitution) {
    this.uuid = uuid;
    this.name = name;
    this.businessName = businessName;
    this.descriptions = descriptions;
    this.urls = urls;
    this.createdAt = new Date().getTime();
    this.updatedAt = new Date().getTime();
  }
  static create = async (
    DatabaseServices: any,
    data: any
  ): Promise<Institution> => {
    const uuid = uuidv4();
    const institution = new Institution({ ...data, uuid });
    await DatabaseServices.create(
      DatabaseServices.entities.Institution,
      institution
    );
    // ? This can be called in another method for be unecessary to relate a user with institution when it is creted
    await DatabaseServices.relateN2N([
      [
        { label: "institution", pk: uuid },
        { label: "user", pk: data.user.uuid },
      ],
    ]);
    return institution;
  };

  static load = async (DatabaseServices: any, credentials: any) => {
    const project = await Institution.find(DatabaseServices, credentials);
    if (!project) throw new Error("Incorrect credentials!");
    const institution = new Institution(project);
    return institution;
  };

  static find = async (DatabaseServices: any, credentials: any) => {
    const institution: any = await DatabaseServices.findOne(
      DatabaseServices.entities.Institution,
      {
        credentials,
      }
    );
    return institution;
  };

  static findAll = async (DatabaseServices: any, options: any) => {
    const institutions: any = await DatabaseServices.findAll(
      DatabaseServices.entities.Institution,
      options
    );
    return institutions;
  };

  link = async (DatabaseServices: any, options: any) => {};

  unlink = async (DatabaseServices: any, options: any) => {};

  remove = async (DatabaseServices: any, options: any = {}) => {
    await DatabaseServices.unrelateN2N([
      [
        { label: "user", uuid: options.userUUID },
        { label: "institution", uuid: this.uuid },
      ],
    ]);
    return await DatabaseServices.remove(
      DatabaseServices.entities.Institution,
      {
        credentials: { uuid: this.uuid },
      }
    );
  };

  update = async (DatabaseServices: any, data: any) => {
    this.updatedAt = new Date().getTime();
    return await DatabaseServices.update(
      DatabaseServices.entities.Institution,
      { ...this, ...data },
      { credentials: { uuid: this.uuid } }
    );
  };
}
