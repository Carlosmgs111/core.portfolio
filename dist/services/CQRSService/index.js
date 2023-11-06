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
                queryServiceCreateOne: this.QueryService.createOne,
            });
            yield dependencies_1.TaskMessageService.subscribe({
                queryServiceCreateMany: this.QueryService.createMany,
            });
            yield dependencies_1.TaskMessageService.subscribe({
                queryServiceRemoveOne: this.QueryService.removeOne,
            });
            yield dependencies_1.TaskMessageService.subscribe({
                queryServiceUpdateOne: this.QueryService.updateOne,
            });
            yield dependencies_1.TaskMessageService.subscribe({
                queryServiceSetOneRelationship2One: this.QueryService.setOneRelationship2One,
            });
            yield dependencies_1.TaskMessageService.subscribe({
                queryServiceUnsetOneRelationship2One: this.QueryService.unsetOneRelationship2One,
            });
            yield dependencies_1.TaskMessageService.subscribe({
                queryServiceCreateOneRelationshipN2N: this.QueryService.createOneRelationshipN2N,
            });
            yield dependencies_1.TaskMessageService.subscribe({
                queryServiceRemoveOneRelationshipN2N: this.QueryService.removeOneRelationshipN2N,
            });
        });
        this.createOne = (entity, Entity, options = {}) => __awaiter(this, void 0, void 0, function* () {
            dependencies_1.TaskMessageService.publish({
                queryServiceCreateOne: {
                    queryServiceCreateOne: [entity, Entity, options],
                },
            });
            return yield this.CommandService.createOne(entity, Entity, options);
        });
        this.createMany = (entity, entities, options = {}) => __awaiter(this, void 0, void 0, function* () {
            dependencies_1.TaskMessageService.publish({
                queryServiceCreateMany: {
                    queryServiceCreateMany: [entity, entities, options],
                },
            });
            return yield this.CommandService.createMany(entity, entities, options);
        });
        this.findOne = (entity, options = {}) => __awaiter(this, void 0, void 0, function* () { return yield this.QueryService.findOne(entity, options); });
        this.findAll = (entity, options = {}) => __awaiter(this, void 0, void 0, function* () { return yield this.QueryService.findAll(entity, options); });
        this.removeOne = (entity, options) => __awaiter(this, void 0, void 0, function* () {
            dependencies_1.TaskMessageService.publish({
                queryServiceRemoveOne: { queryServiceRemoveOne: [entity, options] },
            });
            return yield this.CommandService.removeOne(entity, options);
        });
        this.updateOne = (entity, Entity, options = {}) => __awaiter(this, void 0, void 0, function* () {
            this.TaskMessageService.publish({
                queryServiceUpdateOne: {
                    queryServiceUpdateOne: [entity, Entity, options],
                },
            });
            return yield this.CommandService.updateOne(entity, Entity, options);
        });
        this.setOneRelationship2One = (entity, refs) => __awaiter(this, void 0, void 0, function* () {
            dependencies_1.TaskMessageService.publish({
                queryServiceSetOneRelationship2One: {
                    queryServiceSetOneRelationship2One: [entity, refs],
                },
            });
            return yield this.CommandService.setOneRelationship2One(entity, refs);
        });
        this.unsetOneRelationship2One = (entity, refs) => __awaiter(this, void 0, void 0, function* () {
            dependencies_1.TaskMessageService.publish({
                queryServiceUnsetOneRelationship2One: {
                    queryServiceUnsetOneRelationship2One: [entity, refs],
                },
            });
            return yield this.CommandService.unsetOneRelationship2One(entity, refs);
        });
        this.createOneRelationshipN2N = (refs) => __awaiter(this, void 0, void 0, function* () {
            dependencies_1.TaskMessageService.publish({
                queryServiceCreateOneRelationshipN2N: {
                    queryServiceCreateOneRelationshipN2N: [refs],
                },
            });
            return yield this.CommandService.createOneRelationshipN2N(refs);
        });
        this.removeOneRelationshipN2N = (refs) => __awaiter(this, void 0, void 0, function* () {
            dependencies_1.TaskMessageService.publish({
                queryServiceRemoveOneRelationshipN2N: {
                    queryServiceRemoveOneRelationshipN2N: [refs],
                },
            });
            return yield this.CommandService.removeOneRelationshipN2N(refs);
        });
        this.checkOneRelationshipN2N = this.CommandService.checkOneRelationshipN2N;
        this.entities = Object.assign(Object.assign({}, this.CommandService.entities), this.QueryService.entities);
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
