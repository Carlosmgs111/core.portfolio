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
        this.createOne = (entity, Entity, options = {}) => __awaiter(this, void 0, void 0, function* () {
            yield dependencies_1.TaskMessageService.assertExchange("queryServiceCreateOne");
            yield dependencies_1.TaskMessageService.receiveMessage({
                queryServiceCreateOne: this.QueryService.createOne,
            });
            dependencies_1.TaskMessageService.sendMessage({
                queryServiceCreateOne: {
                    queryServiceCreateOne: [entity, Entity, options],
                },
            });
            return yield this.CommandService.createOne(entity, Entity, options);
        });
        this.createMany = (entity, entities, options = {}) => __awaiter(this, void 0, void 0, function* () {
            yield dependencies_1.TaskMessageService.assertExchange("queryServiceCreateMany");
            yield dependencies_1.TaskMessageService.receiveMessage({
                queryServiceCreateMany: this.QueryService.createMany,
            });
            dependencies_1.TaskMessageService.sendMessage({
                queryServiceCreateMany: {
                    queryServiceCreateMany: [entity, entities, options],
                },
            }, { queryServiceCreateMany: this.QueryService.createMany })
                .then((response) => {
                console.log({ response });
            })
                .catch((e) => console.log(e.message));
            return yield this.CommandService.createMany(entity, entities, options);
        });
        this.findOne = (entity, options = {}) => __awaiter(this, void 0, void 0, function* () { return yield this.QueryService.findOne(entity, options); });
        this.findAll = (entity, options = {}) => __awaiter(this, void 0, void 0, function* () { return yield this.QueryService.findAll(entity, options); });
        this.removeOne = (entity, options) => __awaiter(this, void 0, void 0, function* () {
            yield dependencies_1.TaskMessageService.assertExchange("queryServiceRemoveOne");
            yield dependencies_1.TaskMessageService.receiveMessage({
                queryServiceRemoveOne: this.QueryService.removeOne,
            });
            dependencies_1.TaskMessageService.sendMessage({
                queryServiceRemoveOne: { queryServiceRemoveOne: [entity, options] },
            });
            return yield this.CommandService.removeOne(entity, options);
        });
        this.updateOne = (entity, Entity, options = {}) => __awaiter(this, void 0, void 0, function* () {
            yield dependencies_1.TaskMessageService.assertExchange("queryServiceUpdateOne");
            yield dependencies_1.TaskMessageService.receiveMessage({
                queryServiceUpdateOne: this.QueryService.updateOne,
            });
            const result = yield this.CommandService.updateOne(entity, Entity, options);
            if (result)
                dependencies_1.TaskMessageService.sendMessage({
                    queryServiceUpdateOne: {
                        queryServiceUpdateOne: [entity, Entity, options],
                    },
                });
            return result;
        });
        this.setOneRelationship2One = (entity, refs) => __awaiter(this, void 0, void 0, function* () {
            yield dependencies_1.TaskMessageService.assertExchange("queryServiceSetOneRelationship2One");
            yield dependencies_1.TaskMessageService.receiveMessage({
                queryServiceSetOneRelationship2One: this.QueryService.setOneRelationship2One,
            });
            dependencies_1.TaskMessageService.sendMessage({
                queryServiceSetOneRelationship2One: {
                    queryServiceSetOneRelationship2One: [entity, refs],
                },
            });
            return yield this.CommandService.setOneRelationship2One(entity, refs);
        });
        this.unsetOneRelationship2One = (entity, refs) => __awaiter(this, void 0, void 0, function* () {
            yield dependencies_1.TaskMessageService.assertExchange("queryServiceUnsetOneRelationship2One");
            yield dependencies_1.TaskMessageService.receiveMessage({
                queryServiceUnsetOneRelationship2One: this.QueryService.unsetOneRelationship2One,
            });
            dependencies_1.TaskMessageService.sendMessage({
                queryServiceUnsetOneRelationship2One: {
                    queryServiceUnsetOneRelationship2One: [entity, refs],
                },
            });
            return yield this.CommandService.unsetOneRelationship2One(entity, refs);
        });
        this.createOneRelationshipN2N = (refs) => __awaiter(this, void 0, void 0, function* () {
            yield dependencies_1.TaskMessageService.assertExchange("queryServiceCreateOneRelationshipN2N");
            yield dependencies_1.TaskMessageService.receiveMessage({
                queryServiceCreateOneRelationshipN2N: this.QueryService.createOneRelationshipN2N,
            });
            dependencies_1.TaskMessageService.sendMessage({
                queryServiceCreateOneRelationshipN2N: {
                    queryServiceCreateOneRelationshipN2N: [refs],
                },
            });
            return yield this.CommandService.createOneRelationshipN2N(refs);
        });
        this.removeOneRelationshipN2N = (refs) => __awaiter(this, void 0, void 0, function* () {
            yield dependencies_1.TaskMessageService.assertExchange("queryServiceRemoveOneRelationshipN2N");
            yield dependencies_1.TaskMessageService.receiveMessage({
                queryServiceRemoveOneRelationshipN2N: this.QueryService.removeOneRelationshipN2N,
            });
            dependencies_1.TaskMessageService.sendMessage({
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
    }
}
exports.CQRSService = CQRSService;
