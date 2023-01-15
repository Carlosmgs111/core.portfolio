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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CQRSService = void 0;
const DatabaseServices_1 = require("../DatabaseServices");
const bull_1 = __importDefault(require("bull"));
class CQRSService {
    constructor() {
        this.QueryService = (0, DatabaseServices_1.DatabaseService)(DatabaseServices_1.Adapters.MongooseAdapter);
        this.CommandService = (0, DatabaseServices_1.DatabaseService)(DatabaseServices_1.Adapters.SequelizeAdapter);
        this.lastSync = new Date().getTime();
        this.createOneInQueryService = new bull_1.default("createOneInQueryService", {
            redis: {
                host: "127.0.0.1",
                port: 6379,
            },
        });
        this.createManyInQueryService = new bull_1.default("createManyInQueryService", {
            redis: {
                host: "127.0.0.1",
                port: 6379,
            },
        });
        this.createOneRelationshipN2NInQueryService = new bull_1.default("createOneRelationshipN2NInQueryService", {
            redis: {
                host: "127.0.0.1",
                port: 6379,
            },
        });
        this.createOneRelationship2OneInQueryService = new bull_1.default("createOneRelationship2OneInQueryService", {
            redis: {
                host: "127.0.0.1",
                port: 6379,
            },
        });
        this.updateOneInQueryService = new bull_1.default("updateOneInQueryService", {
            redis: {
                host: "127.0.0.1",
                port: 6379,
            },
        });
        this.removeOneInQueryService = new bull_1.default("removeOneInQueryService", {
            redis: {
                host: "127.0.0.1",
                port: 6379,
            },
        });
        this.createOne = (entity, Entity, options = {}) => __awaiter(this, void 0, void 0, function* () {
            this.createOneInQueryService.add({ entity, Entity, options }, {
                attempts: 3,
                backoff: { type: "exponential", delay: 60000 },
            });
            return yield this.CommandService.createOne(entity, Entity, options);
        });
        this.createMany = (entity, entities, options = {}) => __awaiter(this, void 0, void 0, function* () {
            this.createManyInQueryService.add({ entity, entities, options }, {
                attempts: 3,
                backoff: { type: "exponential", delay: 60000 },
            });
            return yield this.CommandService.createMany(entity, entities, options);
        });
        this.findOne = (entity, options = {}) => __awaiter(this, void 0, void 0, function* () { return yield this.QueryService.findOne(entity, options); });
        this.findAll = (entity, options = {}) => __awaiter(this, void 0, void 0, function* () { return yield this.QueryService.findAll(entity, options); });
        this.removeOne = (entity, options) => __awaiter(this, void 0, void 0, function* () {
            this.removeOneInQueryService.add({ entity, options }, {
                attempts: 3,
                backoff: { type: "exponential", delay: 60000 },
            });
            return yield this.CommandService.removeOne(entity, options);
        });
        this.updateOne = (entity, Entity, options = {}) => __awaiter(this, void 0, void 0, function* () {
            this.updateOneInQueryService.add({ entity, Entity, options }, {
                attempts: 3,
                backoff: { type: "exponential", delay: 60000 },
            });
            return yield this.CommandService.updateOne(entity, Entity, options);
        });
        this.createOneRelationshipN2N = (refs) => __awaiter(this, void 0, void 0, function* () {
            this.createOneRelationshipN2NInQueryService.add({ refs }, {
                attempts: 3,
                backoff: { type: "exponential", delay: 60000 },
            });
            return yield this.CommandService.createOneRelationshipN2N(refs);
        });
        this.createOneRelationship2One = (entity, refs) => __awaiter(this, void 0, void 0, function* () {
            this.createOneRelationship2OneInQueryService.add({ entity, refs }, {
                attempts: 3,
                backoff: { type: "exponential", delay: 60000 },
            });
            return yield this.CommandService.createOneRelationship2One(entity, refs);
        });
        this.removeOneRelationshipN2N = (refs) => __awaiter(this, void 0, void 0, function* () { return yield this.CommandService.removeOneRelationshipN2N(refs); });
        this.checkOneRelationshipN2N = this.CommandService.checkOneRelationshipN2N;
        this.entities = Object.assign(Object.assign({}, this.CommandService.entities), this.QueryService.entities);
        this.setupEntity = this.CommandService.setupEntity;
        this.info = () => {
            return "Repository Service";
        };
        this.createOneInQueryService.process((job, done) => __awaiter(this, void 0, void 0, function* () {
            const { entity, Entity, options } = job.data;
            try {
                yield this.QueryService.createOne(entity, Entity, options);
                done(null, { message: "Entities created in Query Service Database!" });
            }
            catch (error) {
                console.error(error);
                job.fail(error);
            }
        }));
        this.createManyInQueryService.process((job, done) => __awaiter(this, void 0, void 0, function* () {
            const { entity, entities, options } = job.data;
            try {
                yield this.QueryService.createMany(entity, entities, options);
                done(null, { message: "Entities created in Query Service Database!" });
            }
            catch (error) {
                console.error(error);
                job.fail(error);
            }
        }));
        this.createOneRelationshipN2NInQueryService.process((job, done) => __awaiter(this, void 0, void 0, function* () {
            const { refs } = job.data;
            try {
                yield this.QueryService.createOneRelationshipN2N(refs);
                done(null, {
                    message: "Entities created in Query Service Database!",
                });
            }
            catch (error) {
                console.error(error);
                job.fail(error);
            }
        }));
        this.createOneRelationship2OneInQueryService.process((job, done) => __awaiter(this, void 0, void 0, function* () {
            const { entity, refs } = job.data;
            try {
                yield this.QueryService.createOneRelationship2One(entity, refs);
                done(null, {
                    message: "Entities created in Query Service Database!",
                });
            }
            catch (error) {
                console.error(error);
                job.fail(error);
            }
        }));
        this.updateOneInQueryService.process((job, done) => __awaiter(this, void 0, void 0, function* () {
            const { entity, Entity, options } = job.data;
            try {
                yield this.QueryService.updateOne(entity, Entity, options);
                done(null, { message: "Entities created in Query Service Database!" });
            }
            catch (error) {
                console.error(error);
                job.fail(error);
            }
        }));
        this.removeOneInQueryService.process((job, done) => __awaiter(this, void 0, void 0, function* () {
            const { entity, options } = job.data;
            try {
                yield this.QueryService.removeOne(entity, options);
                done(null, { message: "Entities created in Query Service Database!" });
            }
            catch (error) {
                console.error(error);
                job.fail(error);
            }
        }));
    }
}
exports.CQRSService = CQRSService;
