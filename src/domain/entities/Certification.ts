import { v4 as uuidv4 } from "uuid";
import { getEntityProperties, filterAttrs } from "../../utils";
import boom from "@hapi/boom";

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
    this.updatedAt = new Date().getTime();
  }
  static create = async (
    RepositoryService: any,
    data: any
  ): Promise<Certification> => {
    const uuid = uuidv4();
    const { emitedBy } = data;
    const certification = await RepositoryService.relate2One(
      new Certification({ ...data, uuid }),
      [
        {
          institution: { name: emitedBy },
        },
      ]
    );
    await RepositoryService.create(
      RepositoryService.entities.Certification,
      certification
    );
    await RepositoryService.relateN2N([
      [
        { label: "certification", pk: uuid },
        { label: "user", pk: data.user.uuid },
      ],
    ]);
    return certification;
  };

  static createMany = async (RepositoryService: any, data: any) => {
    // console.log({ data });
    const certificationsCreated = await RepositoryService.createMany(
      RepositoryService.entities.Certification,
      data.map((c: any) => new Certification({ ...c, uuid: uuidv4() }))
    );

    for (let certification in certificationsCreated) {
      await RepositoryService.relate2One(
        { certifications: { uuid: certificationsCreated[certification].uuid } },
        [
          {
            institution: { name: data[certification].emitedBy },
          },
        ]
      );
    }

    for (let certificationIdx in data) {
      await RepositoryService.relateN2N([
        [
          {
            label: "certification",
            pk: certificationsCreated[Number(certificationIdx)].uuid,
          },
          { label: "user", pk: data[Number(certificationIdx)].user.uuid },
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

  remove = async (RepositoryService: any, options: any = {}) => {
    await RepositoryService.unrelateN2N([
      [
        { label: "user", pk: options.userUUID },
        { label: "certification", pk: this.uuid },
      ],
    ]);
    return await RepositoryService.remove(
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

  update = async (RepositoryService: any, data: any) => {
    /* const [exist] = await RepositoryService.checkRelationship(
      RepositoryService.entities.Certification,
      { label: "certification", pk: this.uuid },
      { label: "user", pk: data.user.uuid }
    );
    if (!exist) throw boom.conflict("Relationship doesn't exist!"); */
    this.updatedAt = new Date().getTime();
    await RepositoryService.update(
      RepositoryService.entities.Certification,
      {
        updatedAt: this.updatedAt,
        ...filterAttrs(data, ["uuid", "user", "token"]),
      },
      { credentials: { uuid: this.uuid } }
    );
    return this;
  };
}
