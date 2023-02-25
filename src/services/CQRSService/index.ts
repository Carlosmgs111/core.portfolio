import { DatabaseService, Adapters } from "../DatabaseServices";
import { createQueueService } from "../QueueServices";

export class CQRSService {
  QueryService = DatabaseService(Adapters.MongooseAdapter);
  CommandService = DatabaseService(Adapters.SequelizeAdapter);
  lastSync: number = new Date().getTime();

  private queueService = createQueueService();

  constructor() {
    setTimeout(()=>{this.queueService.createQueue("queryServiceCreateOne");
    this.queueService.receiveMessage(
      "queryServiceCreateOne",
      this.QueryService.createOne
    );
    this.queueService.createQueue("queryServiceCreateMany");
    this.queueService.receiveMessage(
      "queryServiceCreateMany",
      this.QueryService.createMany
    );
    this.queueService.createQueue("queryServiceCreateOneRelationshipN2N");
    this.queueService.receiveMessage(
      "queryServiceCreateOneRelationshipN2N",
      this.QueryService.createOneRelationshipN2N
    );
    this.queueService.createQueue("queryServiceRemoveOneRelationshipN2N");
    this.queueService.receiveMessage(
      "queryServiceRemoveOneRelationshipN2N",
      this.QueryService.removeOneRelationshipN2N
    );
    this.queueService.createQueue("queryServiceSetOneRelationship2One");
    this.queueService.receiveMessage(
      "queryServiceSetOneRelationship2One",
      this.QueryService.setOneRelationship2One
    );
    this.queueService.createQueue("queryServiceUnsetOneRelationship2One");
    this.queueService.receiveMessage(
      "queryServiceUnsetOneRelationship2One",
      this.QueryService.unsetOneRelationship2One
    );
    this.queueService.createQueue("queryServiceUpdateOne");
    this.queueService.receiveMessage(
      "queryServiceUpdateOne",
      this.QueryService.updateOne
    );
    this.queueService.createQueue("queryServiceRemoveOne");
    this.queueService.receiveMessage(
      "queryServiceRemoveOne",
      this.QueryService.removeOne
    );},
    2000)
    
  }

  createOne = async (entity: any, Entity: any, options: any = {}) => {
    this.queueService.sendMessage("queryServiceCreateOne", [
      entity,
      Entity,
      options,
    ]);
    return await this.CommandService.createOne(entity, Entity, options);
  };
  createMany = async (entity: any, entities: any, options: any = {}) => {
    this.queueService.sendMessage("queryServiceCreateMany", [
      entity,
      entities,
      options,
    ]);
    return await this.CommandService.createMany(entity, entities, options);
  };
  findOne = async (entity: any, options: any = {}) =>
    await this.QueryService.findOne(entity, options);
  findAll = async (entity: any, options: any = {}) =>
    await this.QueryService.findAll(entity, options);
  removeOne = async (entity: any, options: any) => {
    this.queueService.sendMessage("queryServiceRemoveOne", [entity, options]);
    return await this.CommandService.removeOne(entity, options);
  };
  updateOne = async (entity: any, Entity: any, options: any = {}) => {
    this.queueService.sendMessage("queryServiceUpdateOne", [
      entity,
      Entity,
      options,
    ]);
    return await this.CommandService.updateOne(entity, Entity, options);
  };
  setOneRelationship2One = async (entity: any, refs: any) => {
    this.queueService.sendMessage("queryServiceSetOneRelationship2One", [
      entity,
      refs,
    ]);
    return await this.CommandService.setOneRelationship2One(entity, refs);
  };
  unsetOneRelationship2One = async (entity: any, refs: any) => {
    this.queueService.sendMessage("queryServiceUnsetOneRelationship2One", [entity, refs]);
    return await this.CommandService.unsetOneRelationship2One(entity, refs);
  };
  createOneRelationshipN2N = async (refs: any) => {
    this.queueService.sendMessage("queryServiceCreateOneRelationshipN2N", [refs]);
    return await this.CommandService.createOneRelationshipN2N(refs);
  };
  removeOneRelationshipN2N = async (refs: any) => {
    this.queueService.sendMessage("queryServiceRemoveOneRelationshipN2N", [refs]);
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
