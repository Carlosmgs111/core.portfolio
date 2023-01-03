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
    console.log({ data });
    const { emitedBy } = data;
    const certification = await DatabaseServices.setupEntity(
      "Certification"
    ).relate2One(new Certification({ ...data, uuid }), [
      {
        institution: { name: emitedBy },
      },
    ]);
    console.log({ certification });
    await DatabaseServices.create(certification);
    await DatabaseServices.relateN2N(
      { label: "certification", pk: uuid },
      { label: "user", pk: data.user.uuid }
    );
    console.log({ data });
    return certification;
  };

  static load = async (DatabaseServices: any, options: any) => {
    DatabaseServices.setupEntity("Certification");
    const certification = await Certification.find(DatabaseServices, options);
    if (!certification) throw new Error("Incorrect credentials!");
    const loadedCertification = new Certification(certification);
    return loadedCertification;
  };

  static find = async (DatabaseServices: any, options: any) => {
    DatabaseServices.setupEntity("Certification");
    const certificate: any = await DatabaseServices.findOne(options);
    return certificate;
  };

  static findAll = async (DatabaseServices: any, options: any = {}) => {
    DatabaseServices.setupEntity("Certification");
    const certificates: any = await DatabaseServices.findAll(options);
    return certificates;
  };

  remove = async (DatabaseServices: any, options: any = {}) => {
    await DatabaseServices.unrelateN2N(
      { label: "user", pk: options.userUUID },
      { label: "certification", pk: this.uuid }
    );
    return await DatabaseServices.setupEntity("Certification").remove({
      credentials: filterAttrs(
        getEntityProperties(this),
        ["title", "uuid"],
        false
      ),
    });
  };

  update = async (DatabaseServices: any, data: any) => {
    const [exist] = await DatabaseServices.checkRelationship(
      { label: "certification", pk: this.uuid },
      { label: "user", pk: data.user.uuid }
    );
    if (!exist) throw boom.conflict("Relationship doesn't exist!");
    DatabaseServices.setupEntity("Certification");
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
