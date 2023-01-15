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
    RepositoryService: any,
    data: any
  ): Promise<Institution> => {
    const uuid = uuidv4();
    const institution = new Institution({ ...data, uuid });
    await RepositoryService.createOne(
      RepositoryService.entities.Institution,
      institution
    );
    // ? This can be called in another method for be unecessary to relate a user with institution when it is creted
    await RepositoryService.createOneRelationshipN2N([
      [
        { label: "institution", pk: uuid },
        { label: "user", pk: data.user.uuid },
      ],
    ]);
    return institution;
  };

  static load = async (RepositoryService: any, credentials: any) => {
    const project = await Institution.find(RepositoryService, credentials);
    if (!project) throw new Error("Incorrect credentials!");
    const institution = new Institution(project);
    return institution;
  };

  static find = async (RepositoryService: any, credentials: any) => {
    const institution: any = await RepositoryService.findOne(
      RepositoryService.entities.Institution,
      {
        credentials,
      }
    );
    return institution;
  };

  static findAll = async (RepositoryService: any, options: any) => {
    const institutions: any = await RepositoryService.findAll(
      RepositoryService.entities.Institution,
      options
    );
    return institutions;
  };

  link = async (RepositoryService: any, options: any) => {};

  unlink = async (RepositoryService: any, options: any) => {};

  remove = async (RepositoryService: any, options: any = {}) => {
    await RepositoryService.removeOneRelationshipN2N([
      [
        { label: "user", uuid: options.userUUID },
        { label: "institution", uuid: this.uuid },
      ],
    ]);
    return await RepositoryService.removeOne(
      RepositoryService.entities.Institution,
      {
        credentials: { uuid: this.uuid },
      }
    );
  };

  update = async (RepositoryService: any, data: any) => {
    this.updatedAt = new Date().getTime();
    return await RepositoryService.updateOne(
      RepositoryService.entities.Institution,
      { ...this, ...data },
      { credentials: { uuid: this.uuid } }
    );
  };
}
