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
const queue_1 = require("./queue");
class CQRSService {
    constructor() {
        this.QueryService = (0, DatabaseServices_1.DatabaseService)(DatabaseServices_1.Adapters.MongooseAdapter);
        this.CommandService = (0, DatabaseServices_1.DatabaseService)(DatabaseServices_1.Adapters.SequelizeAdapter);
        this.lastSync = new Date().getTime();
        this.createOneInQueryService = (0, queue_1.createQueue)("createOneInQueryService");
        this.createManyInQueryService = (0, queue_1.createQueue)("createManyInQueryService");
        this.createOneRelationshipN2NInQueryService = (0, queue_1.createQueue)("createOneRelationshipN2NInQueryService");
        this.removeOneRelationshipN2NInQueryService = (0, queue_1.createQueue)("removeOneRelationshipN2NInQueryService");
        this.createOneRelationship2OneInQueryService = (0, queue_1.createQueue)("createOneRelationship2OneInQueryService");
        this.removeOneRelationship2OneInQueryService = (0, queue_1.createQueue)("removeOneRelationship2OneInQueryService");
        this.updateOneInQueryService = (0, queue_1.createQueue)("updateOneInQueryService");
        this.removeOneInQueryService = (0, queue_1.createQueue)("removeOneInQueryService");
        this.createOne = (entity, Entity, options = {}) => __awaiter(this, void 0, void 0, function* () {
            this.createOneInQueryService.addJob([entity, Entity, options]);
            return yield this.CommandService.createOne(entity, Entity, options);
        });
        this.createMany = (entity, entities, options = {}) => __awaiter(this, void 0, void 0, function* () {
            this.createManyInQueryService.addJob([entity, entities, options]);
            return yield this.CommandService.createMany(entity, entities, options);
        });
        this.findOne = (entity, options = {}) => __awaiter(this, void 0, void 0, function* () { return yield this.QueryService.findOne(entity, options); });
        this.findAll = (entity, options = {}) => __awaiter(this, void 0, void 0, function* () { return yield this.QueryService.findAll(entity, options); });
        this.removeOne = (entity, options) => __awaiter(this, void 0, void 0, function* () {
            this.removeOneInQueryService.addJob([entity, options]);
            return yield this.CommandService.removeOne(entity, options);
        });
        this.updateOne = (entity, Entity, options = {}) => __awaiter(this, void 0, void 0, function* () {
            this.updateOneInQueryService.addJob([entity, Entity, options]);
            return yield this.CommandService.updateOne(entity, Entity, options);
        });
        this.createOneRelationship2One = (entity, refs) => __awaiter(this, void 0, void 0, function* () {
            this.createOneRelationship2OneInQueryService.addJob([entity, refs]);
            return yield this.CommandService.createOneRelationship2One(entity, refs);
        });
        this.removeOneRelationship2One = (entity, refs) => __awaiter(this, void 0, void 0, function* () {
            this.removeOneRelationship2OneInQueryService.addJob([entity, refs]);
            return yield this.CommandService.removeOneRelationship2One(entity, refs);
        });
        this.createOneRelationshipN2N = (refs) => __awaiter(this, void 0, void 0, function* () {
            this.createOneRelationshipN2NInQueryService.addJob([refs]);
            return yield this.CommandService.createOneRelationshipN2N(refs);
        });
        this.removeOneRelationshipN2N = (refs) => __awaiter(this, void 0, void 0, function* () {
            this.removeOneRelationshipN2NInQueryService.addJob([refs]);
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
        this.createOneInQueryService.setProcess(this.QueryService.createOne);
        this.createManyInQueryService.setProcess(this.QueryService.createMany);
        this.createOneRelationshipN2NInQueryService.setProcess(this.QueryService.createOneRelationshipN2N);
        this.removeOneRelationshipN2NInQueryService.setProcess(this.QueryService.removeOneRelationshipN2N);
        this.createOneRelationship2OneInQueryService.setProcess(this.QueryService.createOneRelationship2One);
        this.removeOneRelationship2OneInQueryService.setProcess(this.QueryService.removeOneRelationship2One);
        this.updateOneInQueryService.setProcess(this.QueryService.updateOne);
        this.removeOneInQueryService.setProcess(this.QueryService.removeOne);
    }
}
exports.CQRSService = CQRSService;
