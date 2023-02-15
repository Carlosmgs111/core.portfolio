import { v4 as uuidv4 } from "uuid";
import { getEntityProperties, filterAttrs } from "../../utils";

export class Certification {
  uuid: string = "";
  title: string = "";
  emitedAt: number = 0; // * timestamp
  image: string = ""; // * url to image
  url: string = ""; // * url to certificated course or institution
  tags: string[];
  createdAt: number = 0;
  updatedAt: number = 0;

  constructor({ uuid, title, emitedAt, image, url, tags }: any) {
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
  ): Promise<Certification> => {
    const uuid = data.uuid || uuidv4();
    const { emitedBy } = data;
    const certification = await RepositoryService.createOne(
      RepositoryService.entities.Certification,
      new Certification({ ...data, uuid })
    );

    await RepositoryService.setOneRelationship2One(
      { certifications: { uuid: certification.uuid } },
      [
        {
          institution: { name: emitedBy },
        },
      ]
    );
    await RepositoryService.createOneRelationshipN2N([
      [{ certification: { uuid } }, { user: { uuid: data.user.uuid } }],
    ]);
    return certification;
  };

  static createMany = async (RepositoryService: any, data: any) => {
    // console.log({ data });
    const certificationsCreated = await RepositoryService.createMany(
      RepositoryService.entities.Certification,
      data.map(
        (c: any) => new Certification({ ...c, uuid: c.uuid || uuidv4() })
      )
    );

    for (let certification in certificationsCreated) {
      await RepositoryService.setOneRelationship2One(
        { certifications: { uuid: certificationsCreated[certification].uuid } },
        [
          {
            institution: { name: data[certification].emitedBy },
          },
        ]
      );
    }

    for (let certificationIdx in data) {
      await RepositoryService.createOneRelationshipN2N([
        [
          {
            certification: {
              uuid: certificationsCreated[Number(certificationIdx)].uuid,
            },
          },
          { user: { uuid: data[Number(certificationIdx)].user.uuid } },
        ],
      ]);
    }
    // console.log({ certificationsCreated });
    return certificationsCreated;
  };

  static load = async (RepositoryService: any, options: any) => {
    const certification = await Certification.find(RepositoryService, options);
    if (!certification) throw new Error("Incorrect credentials!");
    const loadedCertification = new Certification(certification);
    console.log({ loadedCertification });
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
    } = await Certification.find(RepositoryService, {
      credentials: { uuid: this.uuid },
      related: [["Institution", { attributes: ["name"], as: "Institution" }]],
    });
    console.log(data.emitedBy, emitedBy);
    if (data.emitedBy && emitedBy !== data.emitedBy) {
      console.log("Must change relationship".bgYellow);
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

    await RepositoryService.updateOne(
      RepositoryService.entities.Certification,
      {
        updatedAt: this.updatedAt,
        ...filterAttrs(data, ["uuid", "user", "token"]),
      },
      { credentials: { uuid: this.uuid } }
    );

    return this;
  };

  remove = async (RepositoryService: any, options: any = {}) => {
    await RepositoryService.unsetOneRelationship2One(
      { certifications: { uuid: this.uuid } },
      [["Institution", { as: "Institution" }]]
    );
    const removed = await RepositoryService.removeOneRelationshipN2N([
      [
        { user: { uuid: options.userUUID } },
        { certification: { uuid: this.uuid } },
      ],
    ]);

    if (!removed) return;
    return await RepositoryService.removeOne(
      RepositoryService.entities.Certification,
      {
        credentials: filterAttrs(
          getEntityProperties(this),
          ["title", "uuid"],
          false
        ),
      }
    );
  };
}
