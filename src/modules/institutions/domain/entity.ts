type Props = {
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

  constructor({ uuid, name, businessName, descriptions, urls }: Props) {
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
    const { uuid, user } = data;
    const institution = new Institution(data);
    await RepositoryService.createOne(
      RepositoryService.entities.Institution,
      institution
    );
    // ? This can be called in another method for be unecessary to relate a user with institution when it is creted
    await RepositoryService.setOneRelationshipManyToMany([
      [{ institution: { uuid } }, { user: { uuid: user.uuid } }],
    ]);
    return institution;
  };

  static load = async (RepositoryService: any, credentials: any) => {
    const project = await Institution.find(RepositoryService, credentials);
    if (!project) throw new Error("Incorrect credentials!");
    const institution = new Institution(project);
    return institution;
  };

  static find = async (RepositoryService: any, indexation: any) => {
    const institution: any = await RepositoryService.findOne(
      RepositoryService.entities.Institution,
      {
        indexation,
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
    await RepositoryService.unsetOneRelationshipManyToMany([
      [{ user: options.userUUID }, { institution: this.uuid }],
    ]);
    return await RepositoryService.removeOne(
      RepositoryService.entities.Institution,
      {
        indexation: { uuid: this.uuid },
      }
    );
  };

  update = async (RepositoryService: any, data: any) => {
    this.updatedAt = new Date().getTime();
    return await RepositoryService.updateOne(
      RepositoryService.entities.Institution,
      { ...this, ...data },
      { indexation: { uuid: this.uuid } }
    );
  };
}
