"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CQRSService = void 0;
const DatabaseServices_1 = require("../DatabaseServices");
const dependencies_1 = require("../../config/dependencies");
class CQRSService {
    constructor() {
        this.QueryService = (0, DatabaseServices_1.DatabaseService)(DatabaseServices_1.Adapters.MongooseAdapter);
        this.CommandService = (0, DatabaseServices_1.DatabaseService)(DatabaseServices_1.Adapters.SequelizeAdapter);
        this.lastSync = new Date().getTime();
        this.TaskMessageService = dependencies_1.TaskMessageService;
        this.initSetup = () => __awaiter(this, void 0, void 0, function* () {
            yield dependencies_1.TaskMessageService.subscribe({
                queryService: { createOne: this.QueryService.createOne },
            });
            yield dependencies_1.TaskMessageService.subscribe({
                queryService: { createMany: this.QueryService.createMany },
            });
            yield dependencies_1.TaskMessageService.subscribe({
                queryService: { removeOne: this.QueryService.removeOne },
            });
            yield dependencies_1.TaskMessageService.subscribe({
                queryService: { updateOne: this.QueryService.updateOne },
            });
            yield dependencies_1.TaskMessageService.subscribe({
                queryService: {
                    setOneRelationship2One: this.QueryService.setOneRelationship2One,
                },
            });
            yield dependencies_1.TaskMessageService.subscribe({
                queryService: {
                    unsetOneRelationship2One: this.QueryService.unsetOneRelationship2One,
                },
            });
            yield dependencies_1.TaskMessageService.subscribe({
                queryService: {
                    setOneRelationshipManyToMany: this.QueryService.setOneRelationshipManyToMany,
                },
            });
            yield dependencies_1.TaskMessageService.subscribe({
                queryService: {
                    unsetOneRelationshipManyToMany: this.QueryService.unsetOneRelationshipManyToMany,
                },
            });
        });
        this.createOne = (entity_1, Entity_1, ...args_1) => __awaiter(this, [entity_1, Entity_1, ...args_1], void 0, function* (entity, Entity, options = {}) {
            this.checkStatus();
            dependencies_1.TaskMessageService.publish({
                queryService: {
                    createOne: [entity, Entity, options],
                },
            });
            return yield this.CommandService.createOne(entity, Entity, options);
        });
        this.createMany = (entity_2, entities_1, ...args_2) => __awaiter(this, [entity_2, entities_1, ...args_2], void 0, function* (entity, entities, options = {}) {
            this.checkStatus();
            dependencies_1.TaskMessageService.publish({
                queryService: {
                    createMany: [entity, entities, options],
                },
            });
            return yield this.CommandService.createMany(entity, entities, options);
        });
        this.findOne = (entity_3, ...args_3) => __awaiter(this, [entity_3, ...args_3], void 0, function* (entity, options = {}) { return yield this.QueryService.findOne(entity, options); });
        this.findAll = (entity_4, ...args_4) => __awaiter(this, [entity_4, ...args_4], void 0, function* (entity, options = {}) { return yield this.QueryService.findAll(entity, options); });
        this.removeOne = (entity, options) => __awaiter(this, void 0, void 0, function* () {
            this.checkStatus();
            dependencies_1.TaskMessageService.publish({
                queryService: { removeOne: [entity, options] },
            });
            return yield this.CommandService.removeOne(entity, options);
        });
        this.updateOne = (entity_5, Entity_2, ...args_5) => __awaiter(this, [entity_5, Entity_2, ...args_5], void 0, function* (entity, Entity, options = {}) {
            this.checkStatus();
            this.TaskMessageService.publish({
                queryService: {
                    updateOne: [entity, Entity, options],
                },
            });
            return yield this.CommandService.updateOne(entity, Entity, options);
        });
        this.setOneRelationship2One = (entity, refs) => __awaiter(this, void 0, void 0, function* () {
            this.checkStatus();
            dependencies_1.TaskMessageService.publish({
                queryService: {
                    setOneRelationship2One: [entity, refs],
                },
            });
            return yield this.CommandService.setOneRelationship2One(entity, refs);
        });
        this.unsetOneRelationship2One = (entity, refs) => __awaiter(this, void 0, void 0, function* () {
            this.checkStatus();
            dependencies_1.TaskMessageService.publish({
                queryService: {
                    unsetOneRelationship2One: [entity, refs],
                },
            });
            return yield this.CommandService.unsetOneRelationship2One(entity, refs);
        });
        this.setOneRelationshipManyToMany = (refs) => __awaiter(this, void 0, void 0, function* () {
            this.checkStatus();
            dependencies_1.TaskMessageService.publish({
                queryService: {
                    setOneRelationshipManyToMany: [refs],
                },
            });
            return yield this.CommandService.setOneRelationshipManyToMany(refs);
        });
        this.unsetOneRelationshipManyToMany = (refs) => __awaiter(this, void 0, void 0, function* () {
            this.checkStatus();
            dependencies_1.TaskMessageService.publish({
                queryService: {
                    unsetOneRelationshipManyToMany: [refs],
                },
            });
            return yield this.CommandService.unsetOneRelationshipManyToMany(refs);
        });
        this.setManyRelationshipsManyToMany = (refsBatch) => __awaiter(this, void 0, void 0, function* () {
            // this.checkStatus();
            // TaskMessageService.publish({
            //   queryService: {
            //     setManyRelationshipsManyToMany: [refsBatch],
            //   },
            // });
            return yield this.CommandService.setManyRelationshipsManyToMany(refsBatch);
        });
        this.checkOneRelationshipN2N = this.CommandService.checkOneRelationshipN2N;
        this.entities = Object.assign(Object.assign({}, this.CommandService.entities), this.QueryService.entities);
        this.checkStatus = () => {
            if (!dependencies_1.TaskMessageService.isOnline)
                throw new Error("Task Message Service offline!");
        };
        this.info = () => {
            console.table({
                "Query Database Service": this.QueryService.serviceDescription,
                "Command Database Service": this.CommandService.serviceDescription,
            });
            return {
                queryDatabaseInterfaceName: this.QueryService.serviceDescription,
                commandDatabaseInterfaceName: this.CommandService.serviceDescription,
            };
        };
        this.close = () => __awaiter(this, void 0, void 0, function* () {
            yield this.CommandService.close();
            yield this.QueryService.close();
        });
        this.dropAllEntities = () => __awaiter(this, void 0, void 0, function* () {
            yield this.CommandService.dropAllEntities();
            yield this.QueryService.dropAllEntities();
        });
        (() => __awaiter(this, void 0, void 0, function* () {
            yield this.initSetup();
        }))();
    }
}
exports.CQRSService = CQRSService;
