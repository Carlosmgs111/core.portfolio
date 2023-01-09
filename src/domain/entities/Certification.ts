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
    DatabaseServices: any,
    data: any
  ): Promise<Certification> => {
    const uuid = uuidv4();
    const { emitedBy } = data;
    const certification = await DatabaseServices.relate2One(
      new Certification({ ...data, uuid }),
      [
        {
          institution: { name: emitedBy },
        },
      ]
    );
    await DatabaseServices.create(
      DatabaseServices.entities.Certification,
      certification
    );
    await DatabaseServices.relateN2N([
      [
        { label: "certification", pk: uuid },
        { label: "user", pk: data.user.uuid },
      ],
    ]);
    return certification;
  };

  static createMany = async (DatabaseServices: any, data: any) => {
    const certifications = [];
    for (let certification of data) {
      certifications.push(
        await DatabaseServices.relate2One(
          new Certification({ ...certification, uuid: uuidv4() }),
          [
            {
              institution: { name: certification.emitedBy },
            },
          ]
        )
      );
    }
    console.log({certifications
    })
    const certificationsCreated = await DatabaseServices.createMany(
      DatabaseServices.entities.Certification,
      certifications
    );

    for (let certificationIdx in data) {
      await DatabaseServices.relateN2N([
        [
          {
            label: "certification",
            pk: certifications[Number(certificationIdx)].uuid,
          },
          { label: "user", pk: data[Number(certificationIdx)].user.uuid },
        ],
      ]);
    }
    console.log({ certificationsCreated });
    return certifications;
  };

  static load = async (DatabaseServices: any, options: any) => {
    const certification = await Certification.find(DatabaseServices, options);
    if (!certification) throw new Error("Incorrect credentials!");
    const loadedCertification = new Certification(certification);
    return loadedCertification;
  };

  static find = async (DatabaseServices: any, options: any) => {
    const certificate: any = await DatabaseServices.findOne(
      DatabaseServices.entities.Certification,
      options
    );
    return certificate;
  };

  static findAll = async (DatabaseServices: any, options: any = {}) => {
    const certificates: any = await DatabaseServices.findAll(
      DatabaseServices.entities.Certification,
      options
    );
    return certificates;
  };

  remove = async (DatabaseServices: any, options: any = {}) => {
    await DatabaseServices.unrelateN2N([
      [
        { label: "user", pk: options.userUUID },
        { label: "certification", pk: this.uuid },
      ],
    ]);
    return await DatabaseServices.remove(
      DatabaseServices.entities.Certification,
      {
        credentials: filterAttrs(
          getEntityProperties(this),
          ["title", "uuid"],
          false
        ),
      }
    );
  };

  update = async (DatabaseServices: any, data: any) => {
    const [exist] = await DatabaseServices.checkRelationship(
      DatabaseServices.entities.Certification,
      { label: "certification", pk: this.uuid },
      { label: "user", pk: data.user.uuid }
    );
    if (!exist) throw boom.conflict("Relationship doesn't exist!");
    this.updatedAt = new Date().getTime();
    await DatabaseServices.update(
      {
        updatedAt: this.updatedAt,
        ...filterAttrs(data, ["uuid", "user", "token"]),
      },
      { credentials: { uuid: this.uuid } }
    );
    return this;
  };
}
