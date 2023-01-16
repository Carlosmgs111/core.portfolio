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
        this.createOneInQueryService = (0, queue_1.addQueue)("createOneInQueryService");
        this.createManyInQueryService = (0, queue_1.addQueue)("createManyInQueryService");
        this.createOneRelationshipN2NInQueryService = (0, queue_1.addQueue)("createOneRelationshipN2NInQueryService");
        this.removeOneRelationshipN2NInQueryService = (0, queue_1.addQueue)("removeOneRelationshipN2NInQueryService");
        this.createOneRelationship2OneInQueryService = (0, queue_1.addQueue)("createOneRelationship2OneInQueryService");
        this.removeOneRelationship2OneInQueryService = (0, queue_1.addQueue)("removeOneRelationship2OneInQueryService");
        this.updateOneInQueryService = (0, queue_1.addQueue)("updateOneInQueryService");
        this.removeOneInQueryService = (0, queue_1.addQueue)("removeOneInQueryService");
        this.createOne = (entity, Entity, options = {}) => __awaiter(this, void 0, void 0, function* () {
            (0, queue_1.addJobToQueue)(this.createOneInQueryService, [entity, Entity, options]);
            return yield this.CommandService.createOne(entity, Entity, options);
        });
        this.createMany = (entity, entities, options = {}) => __awaiter(this, void 0, void 0, function* () {
            (0, queue_1.addJobToQueue)(this.createManyInQueryService, [entity, entities, options]);
            return yield this.CommandService.createMany(entity, entities, options);
        });
        this.findOne = (entity, options = {}) => __awaiter(this, void 0, void 0, function* () { return yield this.QueryService.findOne(entity, options); });
        this.findAll = (entity, options = {}) => __awaiter(this, void 0, void 0, function* () { return yield this.QueryService.findAll(entity, options); });
        this.removeOne = (entity, options) => __awaiter(this, void 0, void 0, function* () {
            (0, queue_1.addJobToQueue)(this.removeOneInQueryService, [entity, options]);
            return yield this.CommandService.removeOne(entity, options);
        });
        this.updateOne = (entity, Entity, options = {}) => __awaiter(this, void 0, void 0, function* () {
            (0, queue_1.addJobToQueue)(this.updateOneInQueryService, [entity, Entity, options]);
            return yield this.CommandService.updateOne(entity, Entity, options);
        });
        this.createOneRelationship2One = (entity, refs) => __awaiter(this, void 0, void 0, function* () {
            (0, queue_1.addJobToQueue)(this.createOneRelationship2OneInQueryService, [entity, refs]);
            return yield this.CommandService.createOneRelationship2One(entity, refs);
        });
        this.removeOneRelationship2One = (entity, refs) => __awaiter(this, void 0, void 0, function* () {
            (0, queue_1.addJobToQueue)(this.removeOneRelationship2OneInQueryService, [entity, refs]);
            return yield this.CommandService.removeOneRelationship2One(entity, refs);
        });
        this.createOneRelationshipN2N = (refs) => __awaiter(this, void 0, void 0, function* () {
            (0, queue_1.addJobToQueue)(this.createOneRelationshipN2NInQueryService, [refs]);
            return yield this.CommandService.createOneRelationshipN2N(refs);
        });
        this.removeOneRelationshipN2N = (refs) => __awaiter(this, void 0, void 0, function* () {
            (0, queue_1.addJobToQueue)(this.removeOneRelationshipN2NInQueryService, [refs]);
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
        (0, queue_1.setProcessToQueue)(this.createOneInQueryService, this.QueryService.createOne);
        (0, queue_1.setProcessToQueue)(this.createManyInQueryService, this.QueryService.createMany);
        (0, queue_1.setProcessToQueue)(this.createOneRelationshipN2NInQueryService, this.QueryService.createOneRelationshipN2N);
        (0, queue_1.setProcessToQueue)(this.removeOneRelationshipN2NInQueryService, this.QueryService.removeOneRelationshipN2N);
        (0, queue_1.setProcessToQueue)(this.createOneRelationship2OneInQueryService, this.QueryService.createOneRelationship2One);
        (0, queue_1.setProcessToQueue)(this.removeOneRelationship2OneInQueryService, this.QueryService.removeOneRelationship2One);
        (0, queue_1.setProcessToQueue)(this.updateOneInQueryService, this.QueryService.updateOne);
        (0, queue_1.setProcessToQueue)(this.removeOneInQueryService, this.QueryService.removeOne);
    }
}
exports.CQRSService = CQRSService;
