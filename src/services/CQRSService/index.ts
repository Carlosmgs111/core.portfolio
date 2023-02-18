import { DatabaseService, Adapters } from "../DatabaseServices";
import { createQueue } from "../QueueServices";

export class CQRSService {
  QueryService = DatabaseService(Adapters.MongooseAdapter);
  CommandService = DatabaseService(Adapters.SequelizeAdapter);
  lastSync: number = new Date().getTime();

  private createOneInQueryService = createQueue("createOneInQueryService");
  private createManyInQueryService = createQueue("createManyInQueryService");
  private createOneRelationshipN2NInQueryService = createQueue(
    "createOneRelationshipN2NInQueryService"
  );
  private removeOneRelationshipN2NInQueryService = createQueue(
    "removeOneRelationshipN2NInQueryService"
  );
  private setOneRelationship2OneInQueryService = createQueue(
    "setOneRelationship2OneInQueryService"
  );
  private unsetOneRelationship2OneInQueryService = createQueue(
    "unsetOneRelationship2OneInQueryService"
  );
  private updateOneInQueryService = createQueue("updateOneInQueryService");
  private removeOneInQueryService = createQueue("removeOneInQueryService");

  constructor() {
    this.createOneInQueryService.setProcess(this.QueryService.createOne);
    this.createManyInQueryService.setProcess(this.QueryService.createMany);
    this.createOneRelationshipN2NInQueryService.setProcess(
      this.QueryService.createOneRelationshipN2N
    );
    this.removeOneRelationshipN2NInQueryService.setProcess(
      this.QueryService.removeOneRelationshipN2N
    );
    this.setOneRelationship2OneInQueryService.setProcess(
      this.QueryService.setOneRelationship2One
    );
    this.unsetOneRelationship2OneInQueryService.setProcess(
      this.QueryService.unsetOneRelationship2One
    );
    this.updateOneInQueryService.setProcess(this.QueryService.updateOne);
    this.removeOneInQueryService.setProcess(this.QueryService.removeOne);
  }

  createOne = async (entity: any, Entity: any, options: any = {}) => {
    this.createOneInQueryService.addJob([entity, Entity, options]);
    return await this.CommandService.createOne(entity, Entity, options);
  };
  createMany = async (entity: any, entities: any, options: any = {}) => {
    this.createManyInQueryService.addJob([entity, entities, options]);
    return await this.CommandService.createMany(entity, entities, options);
  };
  findOne = async (entity: any, options: any = {}) =>
    await this.QueryService.findOne(entity, options);
  findAll = async (entity: any, options: any = {}) =>
    await this.QueryService.findAll(entity, options);
  removeOne = async (entity: any, options: any) => {
    this.removeOneInQueryService.addJob([entity, options]);
    return await this.CommandService.removeOne(entity, options);
  };
  updateOne = async (entity: any, Entity: any, options: any = {}) => {
    this.updateOneInQueryService.addJob([entity, Entity, options]);
    return await this.CommandService.updateOne(entity, Entity, options);
  };
  setOneRelationship2One = async (entity: any, refs: any) => {
    this.setOneRelationship2OneInQueryService.addJob([entity, refs]);
    return await this.CommandService.setOneRelationship2One(entity, refs);
  };
  unsetOneRelationship2One = async (entity: any, refs: any) => {
    this.unsetOneRelationship2OneInQueryService.addJob([entity, refs]);
    return await this.CommandService.unsetOneRelationship2One(entity, refs);
  };
  createOneRelationshipN2N = async (refs: any) => {
    this.createOneRelationshipN2NInQueryService.addJob([refs]);
    return await this.CommandService.createOneRelationshipN2N(refs);
  };
  removeOneRelationshipN2N = async (refs: any) => {
    this.removeOneRelationshipN2NInQueryService.addJob([refs]);
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
