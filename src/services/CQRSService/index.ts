import { DatabaseService, Adapters } from "../DatabaseServices";
import { TaskMessageService } from "../../config/dependencies";

export class CQRSService {
  QueryService = DatabaseService(Adapters.MongooseAdapter);
  CommandService = DatabaseService(Adapters.SequelizeAdapter);
  lastSync: number = new Date().getTime();

  constructor() {}

  createOne = async (entity: any, Entity: any, options: any = {}) => {
    await TaskMessageService.assertExchange("queryServiceCreateOne");
    await TaskMessageService.receiveMessage({
      queryServiceCreateOne: this.QueryService.createOne,
    });
    TaskMessageService.sendMessage({
      queryServiceCreateOne: {
        queryServiceCreateOne: [entity, Entity, options],
      },
    });
    return await this.CommandService.createOne(entity, Entity, options);
  };
  createMany = async (entity: any, entities: any, options: any = {}) => {
    await TaskMessageService.assertExchange("queryServiceCreateMany");
    await TaskMessageService.receiveMessage({
      queryServiceCreateMany: this.QueryService.createMany,
    });
    TaskMessageService.sendMessage(
      {
        queryServiceCreateMany: {
          queryServiceCreateMany: [entity, entities, options],
        },
      },
      { queryServiceCreateMany: this.QueryService.createMany }
    );
    return await this.CommandService.createMany(entity, entities, options);
  };
  findOne = async (entity: any, options: any = {}) =>
    await this.QueryService.findOne(entity, options);
  findAll = async (entity: any, options: any = {}) =>
    await this.QueryService.findAll(entity, options);
  removeOne = async (entity: any, options: any) => {
    await TaskMessageService.assertExchange("queryServiceRemoveOne");
    await TaskMessageService.receiveMessage({
      queryServiceRemoveOne: this.QueryService.removeOne,
    });
    TaskMessageService.sendMessage({
      queryServiceRemoveOne: { queryServiceRemoveOne: [entity, options] },
    });
    return await this.CommandService.removeOne(entity, options);
  };
  updateOne = async (entity: any, Entity: any, options: any = {}) => {
    await TaskMessageService.assertExchange("queryServiceUpdateOne");
    await TaskMessageService.receiveMessage({
      queryServiceUpdateOne: this.QueryService.updateOne,
    });
    const result = await this.CommandService.updateOne(entity, Entity, options);
    if (result)
      TaskMessageService.sendMessage({
        queryServiceUpdateOne: {
          queryServiceUpdateOne: [entity, Entity, options],
        },
      });
    return result;
  };
  setOneRelationship2One = async (entity: any, refs: any) => {
    await TaskMessageService.assertExchange(
      "queryServiceSetOneRelationship2One"
    );
    await TaskMessageService.receiveMessage({
      queryServiceSetOneRelationship2One:
        this.QueryService.setOneRelationship2One,
    });
    TaskMessageService.sendMessage({
      queryServiceSetOneRelationship2One: {
        queryServiceSetOneRelationship2One: [entity, refs],
      },
    });
    return await this.CommandService.setOneRelationship2One(entity, refs);
  };
  unsetOneRelationship2One = async (entity: any, refs: any) => {
    await TaskMessageService.assertExchange(
      "queryServiceUnsetOneRelationship2One"
    );
    await TaskMessageService.receiveMessage({
      queryServiceUnsetOneRelationship2One:
        this.QueryService.unsetOneRelationship2One,
    });
    TaskMessageService.sendMessage({
      queryServiceUnsetOneRelationship2One: {
        queryServiceUnsetOneRelationship2One: [entity, refs],
      },
    });
    return await this.CommandService.unsetOneRelationship2One(entity, refs);
  };
  createOneRelationshipN2N = async (refs: any) => {
    await TaskMessageService.assertExchange(
      "queryServiceCreateOneRelationshipN2N"
    );
    await TaskMessageService.receiveMessage({
      queryServiceCreateOneRelationshipN2N:
        this.QueryService.createOneRelationshipN2N,
    });
    TaskMessageService.sendMessage({
      queryServiceCreateOneRelationshipN2N: {
        queryServiceCreateOneRelationshipN2N: [refs],
      },
    });
    return await this.CommandService.createOneRelationshipN2N(refs);
  };
  removeOneRelationshipN2N = async (refs: any) => {
    await TaskMessageService.assertExchange(
      "queryServiceRemoveOneRelationshipN2N"
    );
    await TaskMessageService.receiveMessage({
      queryServiceRemoveOneRelationshipN2N:
        this.QueryService.removeOneRelationshipN2N,
    });
    TaskMessageService.sendMessage({
      queryServiceRemoveOneRelationshipN2N: {
        queryServiceRemoveOneRelationshipN2N: [refs],
      },
    });
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

  close = async () => {
    await this.CommandService.close();
    await this.QueryService.close();
  };

  dropAllEntities = async () => {
    await this.CommandService.dropAllEntities();
    await this.QueryService.dropAllEntities();
  };
}
