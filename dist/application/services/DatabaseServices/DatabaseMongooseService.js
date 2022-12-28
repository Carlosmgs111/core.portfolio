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
const mongoose_1 = require("../../../infrastructure/repositories/mongoose");
const models_1 = __importDefault(require("../../../infrastructure/repositories/mongoose/models"));
class DatabaseMongooseService {
    constructor({}) {
        this.serviceDescription = "Mongoose Interface Database Service";
        this.create = (Entity, options) => __awaiter(this, void 0, void 0, function* () {
            const entity = new this.Entity(Entity);
            yield entity.save();
            return entity;
        });
        this.findAll = (options) => __awaiter(this, void 0, void 0, function* () {
            const entities = yield this.Entity.find(this.adapter(options));
            return entities;
        });
        this.findOne = (Entity) => __awaiter(this, void 0, void 0, function* () {
            const { credentials } = Entity;
            console.log({ models: models_1.default });
            const entity = yield this.Entity.findOne(credentials);
            return entity;
        });
        this.remove = (Entity) => __awaiter(this, void 0, void 0, function* () {
            return yield this.Entity.deleteOne(Entity);
        });
        this.update = (Entity) => __awaiter(this, void 0, void 0, function* () {
            const model = yield this.Entity.updateOne({ uuid: Entity.uuid }, Entity);
            return model;
        });
        this.getRelated = () => __awaiter(this, void 0, void 0, function* () { });
        this.relate = () => __awaiter(this, void 0, void 0, function* () { });
        this.unrelate = () => __awaiter(this, void 0, void 0, function* () { });
        this.checkRelationship = () => __awaiter(this, void 0, void 0, function* () { });
        this.adapter = (options) => {
            const { credentials } = options;
            return { where: credentials };
        };
        this.hasMany = () => { };
        this.syncModels = () => { };
        (0, mongoose_1.connect)();
    }
    setupEntity(entityLabel) {
        this.Entity = models_1.default[entityLabel];
        return this;
    }
}
exports.default = DatabaseMongooseService;
