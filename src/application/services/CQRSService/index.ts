import { DatabaseService, Adapters } from "../DatabaseServices";
import Queue from "bull";
export class CQRSService {
  QueryService = DatabaseService(Adapters.MongooseAdapter);
  CommandService = DatabaseService(Adapters.SequelizeAdapter);
  lastSync: number = new Date().getTime();

  private createOneInQueryService = new Queue("createOneInQueryService", {
    redis: {
      host: "127.0.0.1",
      port: 6379,
    },
  });
  private createManyInQueryService = new Queue("createManyInQueryService", {
    redis: {
      host: "127.0.0.1",
      port: 6379,
    },
  });
  private createOneRelationshipN2NInQueryService = new Queue(
    "createOneRelationshipN2NInQueryService",
    {
      redis: {
        host: "127.0.0.1",
        port: 6379,
      },
    }
  );
  private createOneRelationship2OneInQueryService = new Queue(
    "createOneRelationship2OneInQueryService",
    {
      redis: {
        host: "127.0.0.1",
        port: 6379,
      },
    }
  );
  private updateOneInQueryService = new Queue("updateOneInQueryService", {
    redis: {
      host: "127.0.0.1",
      port: 6379,
    },
  });
  private removeOneInQueryService = new Queue("removeOneInQueryService", {
    redis: {
      host: "127.0.0.1",
      port: 6379,
    },
  });

  constructor() {
    this.createOneInQueryService.process(async (job: any, done: any) => {
      const { entity, Entity, options } = job.data;
      try {
        await this.QueryService.createOne(entity, Entity, options);
        done(null, { message: "Entities created in Query Service Database!" });
      } catch (error) {
        console.error(error);
        job.fail(error);
      }
    });
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
    this.createOneRelationshipN2NInQueryService.process(
      async (job: any, done: any) => {
        const { refs } = job.data;
        try {
          await this.QueryService.createOneRelationshipN2N(refs);
          done(null, {
            message: "Entities created in Query Service Database!",
          });
        } catch (error: any) {
          console.error(error);
          job.fail(error);
        }
      }
    );
    this.createOneRelationship2OneInQueryService.process(
      async (job: any, done: any) => {
        const { entity, refs } = job.data;
        try {
          await this.QueryService.createOneRelationship2One(entity, refs);
          done(null, {
            message: "Entities created in Query Service Database!",
          });
        } catch (error) {
          console.error(error);
          job.fail(error);
        }
      }
    );
    this.updateOneInQueryService.process(async (job: any, done: any) => {
      const { entity, Entity, options } = job.data;
      try {
        await this.QueryService.updateOne(entity, Entity, options);
        done(null, { message: "Entities created in Query Service Database!" });
      } catch (error) {
        console.error(error);
        job.fail(error);
      }
    });
    this.removeOneInQueryService.process(async (job: any, done: any) => {
      const { entity, options } = job.data;
      try {
        await this.QueryService.removeOne(entity, options);
        done(null, { message: "Entities created in Query Service Database!" });
      } catch (error) {
        console.error(error);
        job.fail(error);
      }
    });
  }

  createOne = async (entity: any, Entity: any, options: any = {}) => {
    this.createOneInQueryService.add(
      { entity, Entity, options },
      {
        attempts: 3,
        backoff: { type: "exponential", delay: 60000 },
      }
    );
    return await this.CommandService.createOne(entity, Entity, options);
  };
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
  removeOne = async (entity: any, options: any) => {
    this.removeOneInQueryService.add(
      { entity, options },
      {
        attempts: 3,
        backoff: { type: "exponential", delay: 60000 },
      }
    );
    return await this.CommandService.removeOne(entity, options);
  };
  updateOne = async (entity: any, Entity: any, options: any = {}) => {
    this.updateOneInQueryService.add(
      { entity, Entity, options },
      {
        attempts: 3,
        backoff: { type: "exponential", delay: 60000 },
      }
    );
    return await this.CommandService.updateOne(entity, Entity, options);
  };
  createOneRelationshipN2N = async (refs: any) => {
    this.createOneRelationshipN2NInQueryService.add(
      { refs },
      {
        attempts: 3,
        backoff: { type: "exponential", delay: 60000 },
      }
    );
    return await this.CommandService.createOneRelationshipN2N(refs);
  };
  createOneRelationship2One = async (entity: any, refs: any) => {
    this.createOneRelationship2OneInQueryService.add(
      { entity, refs },
      {
        attempts: 3,
        backoff: { type: "exponential", delay: 60000 },
      }
    );

    return await this.CommandService.createOneRelationship2One(entity, refs);
  };
  removeOneRelationshipN2N = async (refs: any) =>
    await this.CommandService.removeOneRelationshipN2N(refs);
  checkOneRelationshipN2N = this.CommandService.checkOneRelationshipN2N;
  entities = { ...this.CommandService.entities, ...this.QueryService.entities };
  setupEntity = this.CommandService.setupEntity;
  info = () => {
    return "Repository Service";
  };
}
