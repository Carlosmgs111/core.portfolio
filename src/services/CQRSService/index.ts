import { RepositoryService, Adapters } from "../RepositoryService";
import { TaskMessageService } from "../../config/dependencies";

export class CQRSService {
  QueryService = RepositoryService(Adapters.MongooseAdapter);
  CommandService = RepositoryService(Adapters.SequelizeAdapter);
  lastSync: number = new Date().getTime();
  entities: any = {};
  constructor() {
    (async () => {
      await this.initSetup();
      // TODO Check before every query if entities are available
      this.entities = {
        ...this.CommandService.entities,
        ...this.QueryService.entities,
      };
    })();
  }

  initSetup = async () => {
    await TaskMessageService.subscribe({
      queryService: { createOne: this.QueryService.createOne },
    });
    await TaskMessageService.subscribe({
      queryService: { createMany: this.QueryService.createMany },
    });
    await TaskMessageService.subscribe({
      queryService: { removeOne: this.QueryService.removeOne },
    });
    await TaskMessageService.subscribe({
      queryService: { updateOne: this.QueryService.updateOne },
    });
    await TaskMessageService.subscribe({
      queryService: {
        setOneRelationship2One: this.QueryService.setOneRelationship2One,
      },
    });
    await TaskMessageService.subscribe({
      queryService: {
        unsetOneRelationship2One: this.QueryService.unsetOneRelationship2One,
      },
    });
    await TaskMessageService.subscribe({
      queryService: {
        setOneRelationshipManyToMany:
          this.QueryService.setOneRelationshipManyToMany,
      },
    });
    await TaskMessageService.subscribe({
      queryService: {
        unsetOneRelationshipManyToMany:
          this.QueryService.unsetOneRelationshipManyToMany,
      },
    });
  };

  createOne = async (entity: any, Entity: any, options: any = {}) => {
    this.checkStatus();
    this.publishOrWrite("createOne", entity, Entity, options);
    return await this.CommandService.createOne(entity, Entity, options);
  };
  createMany = async (entity: any, entities: any, options: any = {}) => {
    this.checkStatus();
    this.publishOrWrite("createMany", entity, entities, options);
    return await this.CommandService.createMany(entity, entities, options);
  };
  findOne = async (entity: any, options: any = {}) => {
    return await this.QueryService.findOne(entity, options);
  };
  findAll = async (entity: any, options: any = {}) => {
    return await this.QueryService.findAll(entity, options);
  };
  removeOne = async (entity: any, options: any) => {
    this.checkStatus();
    this.publishOrWrite("removeOne", entity, options);
    return await this.CommandService.removeOne(entity, options);
  };
  updateOne = async (entity: any, Entity: any, options: any = {}) => {
    this.checkStatus();
    this.publishOrWrite("updateOne", entity, Entity, options);
    return await this.CommandService.updateOne(entity, Entity, options);
  };
  setOneRelationship2One = async (entity: any, refs: any) => {
    this.checkStatus();
    this.publishOrWrite("setOneRelationship2One", entity, refs);
    return await this.CommandService.setOneRelationship2One(entity, refs);
  };
  unsetOneRelationship2One = async (entity: any, refs: any) => {
    this.publishOrWrite("unsetOneRelationship2One", entity, refs);
    return await this.CommandService.unsetOneRelationship2One(entity, refs);
  };
  setOneRelationshipManyToMany = async (refs: any) => {
    this.checkStatus();
    this.publishOrWrite("setOneRelationshipManyToMany", refs);
    return await this.CommandService.setOneRelationshipManyToMany(refs);
  };
  unsetOneRelationshipManyToMany = async (refs: any) => {
    this.checkStatus();
    this.publishOrWrite("unsetOneRelationshipManyToMany", refs);
    return await this.CommandService.unsetOneRelationshipManyToMany(refs);
  };
  setManyRelationshipsManyToMany = async (refsBatch: any) => {
    this.checkStatus();
    this.publishOrWrite("setManyRelationshipsManyToMany", refsBatch);
    return await this.CommandService.setManyRelationshipsManyToMany(refsBatch);
  };
  checkOneRelationshipN2N = this.CommandService.checkOneRelationshipN2N;
  checkStatus = () => {
    if (!TaskMessageService.isOnline)
      throw new Error("Task Message Service offline!");
  };
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
  reconnectTaskMessageService = async () => {
    await TaskMessageService.reconnect();
  };
  private publishOrWrite = async (task: string, ...message: any) => {
    if (
      TaskMessageService.connected &&
      !TaskMessageService.subscriptions[task]
    ) {
      console.log("Subscribing to TaskMessageService".bgYellow);
      TaskMessageService.subscriptions[task] =
        await TaskMessageService.subscribe({
          queryService: {
            [task]: this.QueryService[task],
          },
        });
    }
    if (
      TaskMessageService.connected &&
      TaskMessageService.subscriptions[task]
    ) {
      console.log("Using TaskMessageService".bgGreen);
      return TaskMessageService.publish({
        queryService: { [task]: message },
      });
    }
    if (!TaskMessageService.connected) {
      console.log("Skipping TaskMessageService".bgYellow);
      this.reconnectTaskMessageService();
      await this.QueryService[task](...message);
    }
  };
}
