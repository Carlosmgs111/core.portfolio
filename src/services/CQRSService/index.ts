import { DatabaseService, Adapters } from "../DatabaseServices";
import { TaskMessageService } from "../../config/dependencies";

export class CQRSService {
  QueryService = DatabaseService(Adapters.MongooseAdapter);
  CommandService = DatabaseService(Adapters.SequelizeAdapter);
  lastSync: number = new Date().getTime();

  private TaskMessageService: any = TaskMessageService;

  constructor() {
    (async () => {
      await this.initSetup();
    })();
  }

  initSetup = async () => {
    await TaskMessageService.subscribe({
      queryServiceCreateOne: this.QueryService.createOne,
    });
    await TaskMessageService.subscribe({
      queryServiceCreateMany: this.QueryService.createMany,
    });
    await TaskMessageService.subscribe({
      queryServiceRemoveOne: this.QueryService.removeOne,
    });
    await TaskMessageService.subscribe({
      queryServiceUpdateOne: this.QueryService.updateOne,
    });
    await TaskMessageService.subscribe({
      queryServiceSetOneRelationship2One:
        this.QueryService.setOneRelationship2One,
    });
    await TaskMessageService.subscribe({
      queryServiceUnsetOneRelationship2One:
        this.QueryService.unsetOneRelationship2One,
    });
    await TaskMessageService.subscribe({
      queryServiceCreateOneRelationshipN2N:
        this.QueryService.createOneRelationshipN2N,
    });
    await TaskMessageService.subscribe({
      queryServiceRemoveOneRelationshipN2N:
        this.QueryService.removeOneRelationshipN2N,
    });
  };

  createOne = async (entity: any, Entity: any, options: any = {}) => {
    TaskMessageService.publish({
      queryServiceCreateOne: {
        queryServiceCreateOne: [entity, Entity, options],
      },
    });
    return await this.CommandService.createOne(entity, Entity, options);
  };
  createMany = async (entity: any, entities: any, options: any = {}) => {
    TaskMessageService.publish({
      queryServiceCreateMany: {
        queryServiceCreateMany: [entity, entities, options],
      },
    });
    return await this.CommandService.createMany(entity, entities, options);
  };
  findOne = async (entity: any, options: any = {}) =>
    await this.QueryService.findOne(entity, options);
  findAll = async (entity: any, options: any = {}) =>
    await this.QueryService.findAll(entity, options);
  removeOne = async (entity: any, options: any) => {
    TaskMessageService.publish({
      queryServiceRemoveOne: { queryServiceRemoveOne: [entity, options] },
    });
    return await this.CommandService.removeOne(entity, options);
  };
  updateOne = async (entity: any, Entity: any, options: any = {}) => {
    this.TaskMessageService.publish({
      queryServiceUpdateOne: {
        queryServiceUpdateOne: [entity, Entity, options],
      },
    });
    return await this.CommandService.updateOne(entity, Entity, options);
  };
  setOneRelationship2One = async (entity: any, refs: any) => {
    TaskMessageService.publish({
      queryServiceSetOneRelationship2One: {
        queryServiceSetOneRelationship2One: [entity, refs],
      },
    });
    return await this.CommandService.setOneRelationship2One(entity, refs);
  };
  unsetOneRelationship2One = async (entity: any, refs: any) => {
    TaskMessageService.publish({
      queryServiceUnsetOneRelationship2One: {
        queryServiceUnsetOneRelationship2One: [entity, refs],
      },
    });
    return await this.CommandService.unsetOneRelationship2One(entity, refs);
  };
  createOneRelationshipN2N = async (refs: any) => {
    TaskMessageService.publish({
      queryServiceCreateOneRelationshipN2N: {
        queryServiceCreateOneRelationshipN2N: [refs],
      },
    });
    return await this.CommandService.createOneRelationshipN2N(refs);
  };
  removeOneRelationshipN2N = async (refs: any) => {
    TaskMessageService.publish({
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
