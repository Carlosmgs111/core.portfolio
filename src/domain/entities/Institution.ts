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
    DatabaseServices.setupModel("Institution")
    const uuid = uuidv4();
    const institution = new Institution({ ...data, uuid });
    await DatabaseServices.create(institution);
    return institution;
  };

  static load = async (DatabaseServices: any, credentials: any) => {
    DatabaseServices.setupModel("Institution")
    const project = await Institution.find(DatabaseServices, credentials);
    if (!project) throw new Error("Incorrect credentials!");
    const institution = new Institution(project);
    return institution;
  };

  static find = async (DatabaseServices: any, credentials: any) => {
    DatabaseServices.setupModel("Institution")
    console.log({ credentials });
    const institution: any = await DatabaseServices.findOne({
      ...credentials,
    });
    console.log({ institution });
    return institution;
  };

  static findAll = async (DatabaseServices: any, credentials: any) => {
    DatabaseServices.setupModel("Institution");
    console.log({credentials})
    const institutions: any = await DatabaseServices.findAll(
      credentials
    );
    return institutions;
  };

  remove = async (DatabaseServices: any) => {
    DatabaseServices.setupModel("Institution")
    return await DatabaseServices.remove(this);
  };

  update = async (DatabaseServices: any, data:any) => {
    DatabaseServices.setupModel("Institution")
    this.updatedAt = new Date().getTime();
    return await DatabaseServices.update({...this, ...data});
  };
}
