export type CertificateProps = {
  uuid: string;
  title: string;
  image: string;
  url: string;
  tags: string[];
  emitedAt: number;
  createdAt: number;
  updatedAt: number;
};

export class Certificate {
  uuid: string = "";
  title: string = "";
  emitedAt: number = 0; // * timestamp
  image: string = ""; // * url to image
  url: string = ""; // * url to certificated course or institution
  tags: string[];
  createdAt: number = 0;
  updatedAt: number = 0;

  constructor({ uuid, title, emitedAt, image, url, tags }: CertificateProps) {
    this.uuid = uuid;
    this.title = title;
    this.emitedAt = emitedAt;
    this.image = image;
    this.url = url;
    this.tags = tags;
    this.createdAt = new Date().getTime();
    this.updatedAt = this.createdAt;
  }
  static createOne = async (
    RepositoryService: any,
    data: any
  ): Promise<Certificate> => {
    const { uuid } = data;
    const { emitedBy } = data;
    const certification = await RepositoryService.createOne(
      RepositoryService.entities.Certification,
      new Certificate({ ...data, uuid })
    );

    await RepositoryService.setOneRelationship2One(
      { certifications: { uuid: certification.uuid } },
      [
        {
          institution: { name: emitedBy },
        },
      ]
    );
    await RepositoryService.setOneRelationshipManyToMany([
      [{ certification: { uuid } }, { user: { uuid: data.user.uuid } }],
    ]);
    return certification;
  };

  static createMany = async (RepositoryService: any, data: any) => {
    const certificationsCreated = await RepositoryService.createMany(
      RepositoryService.entities.Certification,
      data
    );

    for (let certification in certificationsCreated) {
      RepositoryService.setOneRelationship2One(
        { certifications: { uuid: certificationsCreated[certification].uuid } },
        [
          {
            institution: { name: data[certification].emitedBy },
          },
        ]
      );
    }

    // const refsBatch = data.map((_: any, index: any) => [
    //   {
    //     certification: {
    //       uuid: certificationsCreated[Number(index)].uuid,
    //     },
    //   },
    //   { user: { uuid: data[Number(index)].user.uuid } },
    // ]);

    // RepositoryService.setManyRelationshipsManyToMany(refsBatch);

    for (let certificationIdx in data) {
      RepositoryService.setOneRelationshipManyToMany([
        {
          certification: {
            uuid: certificationsCreated[Number(certificationIdx)].uuid,
          },
        },
        { user: { uuid: data[Number(certificationIdx)].user.uuid } },
      ]);
    }
    return certificationsCreated;
  };

  static load = async (RepositoryService: any, options: any) => {
    const certification = await Certificate.find(RepositoryService, options);
    if (!certification) throw new Error("Incorrect credentials!");
    const loadedCertification = new Certificate(certification);
    return loadedCertification;
  };

  static find = async (RepositoryService: any, options: any) => {
    const certificate: any = await RepositoryService.findOne(
      RepositoryService.entities.Certification,
      options
    );
    return certificate;
  };

  static findAll = async (RepositoryService: any, options: any = {}) => {
    const certificates: any = await RepositoryService.findAll(
      RepositoryService.entities.Certification,
      options
    );
    return certificates;
  };

  update = async (RepositoryService: any, data: any) => {
    this.updatedAt = new Date().getTime();
    const {
      Institution: { name: emitedBy },
    } = await Certificate.find(RepositoryService, {
      indexation: { uuid: this.uuid },
      related: [["Institution", { attributes: ["name"], as: "Institution" }]],
    });
    if (data.emitedBy && emitedBy !== data.emitedBy) {
      "Must change relationship".bgYellow;
      await RepositoryService.unsetOneRelationship2One(
        { certifications: { uuid: this.uuid } },
        [["Institution", { as: "Institution" }]]
      );
      await RepositoryService.setOneRelationship2One(
        { certifications: { uuid: this.uuid } },
        [
          {
            institution: { name: data.emitedBy },
          },
        ]
      );
    }
    return await RepositoryService.updateOne(
      RepositoryService.entities.Certification,
      { updatedAt: this.updatedAt, ...data },
      { indexation: { uuid: this.uuid } }
    );
  };

  remove = async (RepositoryService: any, options: any = {}) => {
    await RepositoryService.unsetOneRelationship2One(
      { certifications: { uuid: this.uuid } },
      [["Institution", { as: "Institution" }]]
    );
    const removed = await RepositoryService.unsetOneRelationshipManyToMany([
      { user: { uuid: options.userUUID } },
      { certification: { uuid: this.uuid } },
    ]);

    if (!removed) return;
    return await RepositoryService.removeOne(
      RepositoryService.entities.Certification,
      {
        indexation: { uuid: this.uuid },
      }
    );
  };
}
