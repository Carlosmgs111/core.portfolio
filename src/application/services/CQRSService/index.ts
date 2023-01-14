import { DatabaseService, Adapters } from "../DatabaseServices";
import { Certification } from "../../../domain/entities/Certification";
import { Op } from "sequelize";
import Queue from "bull";

export class CQRSService {
  QueryService = DatabaseService(Adapters.MongooseAdapter);
  CommandService = DatabaseService(Adapters.SequelizeAdapter);
  lastSync: number = new Date().getTime();
  createManyInQueryService = new Queue("createManyInQueryService", {
    redis: {
      host: "127.0.0.1",
      port: 6379,
    },
  });
  relateN2NInQueryService = new Queue("relateN2N3InQueryService", {
    redis: {
      host: "127.0.0.1",
      port: 6379,
    },
  });
  relate2OneInQueryService = new Queue("relate2OneInQueryService", {
    redis: {
      host: "127.0.0.1",
      port: 6379,
    },
  });

  constructor() {
    this.createManyInQueryService.process(async (job: any, done: any) => {
      const { entity, entities, options } = job.data;
      try {
        await this.QueryService.createMany(entity, entities, options);
        done(null, { message: "Entities created in Query Service Database!" });
      } catch (error) {
        console.error(error);
        job.fail(error);
      }
    });
    this.relateN2NInQueryService.process(async (job: any, done: any) => {
      const { refs } = job.data;
      try {
        await this.QueryService.relateN2N(refs);
        done(null, {
          message: "Entities created in Query Service Database!",
        });
      } catch (error: any) {
        console.error(error);
        job.fail(error);
      }
    });
    this.relate2OneInQueryService.process(async (job: any, done: any) => {
      const { entity, refs } = job.data;
      try {
        await this.QueryService.relate2One(entity, refs);
        done(null, { message: "Entities created in Query Service Database!" });
      } catch (error) {
        console.error(error);
        job.fail(error);
      }
    });
  }

  create = async (entity: any, Entity: any, options: any = {}) =>
    await this.CommandService.create(entity, Entity, options);
  createMany = async (entity: any, entities: any, options: any = {}) => {
    this.createManyInQueryService.add(
      { entity, entities, options },
      {
        attempts: 3,
        backoff: { type: "exponential", delay: 60000 },
      }
    );
    return await this.CommandService.createMany(entity, entities, options);
  };
  findOne = async (entity: any, options: any = {}) =>
    await this.QueryService.findOne(entity, options);
  findAll = async (entity: any, options: any = {}) =>
    await this.QueryService.findAll(entity, options);
  remove = async (entity: any, options: any) =>
    await this.CommandService.remove(entity, options);
  update = async (entity: any, Entity: any, options: any = {}) =>
    await this.CommandService.update(entity, Entity, options);
  relateN2N = async (refs: any) => {
    this.relateN2NInQueryService.add(
      { refs },
      {
        attempts: 3,
        backoff: { type: "exponential", delay: 60000 },
      }
    );
    return await this.CommandService.relateN2N(refs);
  };
  relate2One = async (entity: any, refs: any) => {
    this.relate2OneInQueryService.add(
      { entity, refs },
      {
        attempts: 3,
        backoff: { type: "exponential", delay: 60000 },
      }
    );

    return await this.CommandService.relate2One(entity, refs);
  };
  unrelateN2N = async (refs: any) =>
    await this.CommandService.unrelateN2N(refs);
  checkRelationship = this.CommandService.checkRelationship;
  entities = { ...this.CommandService.entities, ...this.QueryService.entities };
  setupEntity = this.CommandService.setupEntity;
  info = () => {
    return "Repository Service";
  };
}
