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
    DatabaseServices.setupEntity("Institution");
    const uuid = uuidv4();
    const institution = new Institution({ ...data, uuid });
    await DatabaseServices.create(institution);
    return institution;
  };

  static load = async (DatabaseServices: any, credentials: any) => {
    DatabaseServices.setupEntity("Institution");
    const project = await Institution.find(DatabaseServices, credentials);
    if (!project) throw new Error("Incorrect credentials!");
    const institution = new Institution(project);
    return institution;
  };

  static find = async (DatabaseServices: any, credentials: any) => {
    DatabaseServices.setupEntity("Institution");
    const institution: any = await DatabaseServices.findOne({
      credentials,
    });
    return institution;
  };

  static findAll = async (DatabaseServices: any, options: any) => {
    DatabaseServices.setupEntity("Institution");
    const institutions: any = await DatabaseServices.findAll(options);
    return institutions;
  };

  remove = async (DatabaseServices: any) => {
    DatabaseServices.setupEntity("Institution");
    return await DatabaseServices.remove({ credentials: { uuid: this.uuid } });
  };

  update = async (DatabaseServices: any, data: any) => {
    DatabaseServices.setupEntity("Institution");
    this.updatedAt = new Date().getTime();
    return await DatabaseServices.update(
      { ...this, ...data },
      { credentials: { uuid: this.uuid } }
    );
  };
}
