import { DatabaseService, Adapters } from "../DatabaseServices";
import { Certification } from "../../../domain/entities/Certification";

export class CQRSService {
  QueryService = DatabaseService(Adapters.MongooseAdapter);
  CommandService = DatabaseService(Adapters.SequelizeAdapter);
  lastSync: number = 0;

  constructor() {}

  create = async (entity: any, Entity: any, options: any = {}) =>
    await this.CommandService.create(entity, Entity, options);
  createMany = async (entity: any, entities: any, options: any = {}) =>
    await this.CommandService.createMany(entity, entities, options);
  findOne = async (entity: any, options: any = {}) =>
    await this.QueryService.findOne(entity, options);
  findAll = async (entity: any, options: any = {}) =>
    await this.QueryService.findAll(entity, options);
  remove = async (entity: any, options: any) =>
    await this.CommandService.remove(entity, options);
  update = async (entity: any, Entity: any, options: any = {}) =>
    await this.CommandService.update(entity, Entity, options);
  relateN2N = async (refs: any) => await this.CommandService.relateN2N(refs);
  relate2One = async (entity: any, refs: any) =>
    await this.CommandService.relate2One(entity, refs);
  unrelateN2N = async (refs: any) =>
    await this.CommandService.unrelateN2N(refs);
  checkRelationship = this.CommandService.checkRelationship;
  entities = { ...this.CommandService.entities, ...this.QueryService.entities };
  setupEntity = this.CommandService.setupEntity;
  sync = async () => {
    try {
      const certifications = await Certification.findAll(this.CommandService, {
        related: [
          [
            "User",
            {
              attributes: ["username","uuid"],
            },
          ],
          ["Institution", { attributes: ["name"], as: "Institution" }],
        ],
      });
      
      await Certification.createMany(
        this.QueryService,
        certifications.map((a: any) => ({
          ...a,
          emitedBy: a.Institution.name,
          user: a.Users[0],
        }))
      );
    } catch (e: any) {
      console.log(e.message.red);
    }
  };
  info = () => {
    return "Repository Service";
  };
}
