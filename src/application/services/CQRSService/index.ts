import { DatabaseService, Adapters } from "../DatabaseServices";
import { addQueue, setProcessToQueue, addJobToQueue } from "./queue";
export class CQRSService {
  QueryService = DatabaseService(Adapters.MongooseAdapter);
  CommandService = DatabaseService(Adapters.SequelizeAdapter);
  lastSync: number = new Date().getTime();

  private createOneInQueryService = addQueue("createOneInQueryService");
  private createManyInQueryService = addQueue("createManyInQueryService");
  private createOneRelationshipN2NInQueryService = addQueue(
    "createOneRelationshipN2NInQueryService"
  );
  private removeOneRelationshipN2NInQueryService = addQueue(
    "removeOneRelationshipN2NInQueryService"
  );
  private createOneRelationship2OneInQueryService = addQueue(
    "createOneRelationship2OneInQueryService"
  );
  private removeOneRelationship2OneInQueryService = addQueue(
    "removeOneRelationship2OneInQueryService"
  );
  private updateOneInQueryService = addQueue("updateOneInQueryService");
  private removeOneInQueryService = addQueue("removeOneInQueryService");

  constructor() {
    setProcessToQueue(
      this.createOneInQueryService,
      this.QueryService.createOne
    );
    setProcessToQueue(
      this.createManyInQueryService,
      this.QueryService.createMany
    );
    setProcessToQueue(
      this.createOneRelationshipN2NInQueryService,
      this.QueryService.createOneRelationshipN2N
    );
    setProcessToQueue(
      this.removeOneRelationshipN2NInQueryService,
      this.QueryService.removeOneRelationshipN2N
    );
    setProcessToQueue(
      this.createOneRelationship2OneInQueryService,
      this.QueryService.createOneRelationship2One
    );
    setProcessToQueue(
      this.removeOneRelationship2OneInQueryService,
      this.QueryService.removeOneRelationship2One
    );
    setProcessToQueue(
      this.updateOneInQueryService,
      this.QueryService.updateOne
    );
    setProcessToQueue(
      this.removeOneInQueryService,
      this.QueryService.removeOne
    );
  }

  createOne = async (entity: any, Entity: any, options: any = {}) => {
    addJobToQueue(this.createOneInQueryService, [entity, Entity, options]);
    return await this.CommandService.createOne(entity, Entity, options);
  };
  createMany = async (entity: any, entities: any, options: any = {}) => {
    addJobToQueue(this.createManyInQueryService, [entity, entities, options]);
    return await this.CommandService.createMany(entity, entities, options);
  };
  findOne = async (entity: any, options: any = {}) =>
    await this.QueryService.findOne(entity, options);
  findAll = async (entity: any, options: any = {}) =>
    await this.QueryService.findAll(entity, options);
  removeOne = async (entity: any, options: any) => {
    addJobToQueue(this.removeOneInQueryService, [entity, options]);
    return await this.CommandService.removeOne(entity, options);
  };
  updateOne = async (entity: any, Entity: any, options: any = {}) => {
    addJobToQueue(this.updateOneInQueryService, [entity, Entity, options]);
    return await this.CommandService.updateOne(entity, Entity, options);
  };
  createOneRelationship2One = async (entity: any, refs: any) => {
    addJobToQueue(this.createOneRelationship2OneInQueryService, [entity, refs]);
    return await this.CommandService.createOneRelationship2One(entity, refs);
  };
  removeOneRelationship2One = async (entity: any, refs: any) => {
    addJobToQueue(this.removeOneRelationship2OneInQueryService, [entity, refs]);
    return await this.CommandService.removeOneRelationship2One(entity, refs);
  };
  createOneRelationshipN2N = async (refs: any) => {
    addJobToQueue(this.createOneRelationshipN2NInQueryService, [refs]);
    return await this.CommandService.createOneRelationshipN2N(refs);
  };
  removeOneRelationshipN2N = async (refs: any) => {
    addJobToQueue(this.removeOneRelationshipN2NInQueryService, [refs]);
    return await this.CommandService.removeOneRelationshipN2N(refs);
  };
  checkOneRelationshipN2N = this.CommandService.checkOneRelationshipN2N;
  entities = { ...this.CommandService.entities, ...this.QueryService.entities };
  info = () => {
    console.table({
      "Query Database Service": this.QueryService.serviceDescription,
      "Command Database Service": this.CommandService.serviceDescription,
    });
    return {
      queryDatabaseInterfaceName: this.QueryService.serviceDescription,
      commandDatabaseInterfaceName: this.CommandService.serviceDescription,
    };
  };
}
