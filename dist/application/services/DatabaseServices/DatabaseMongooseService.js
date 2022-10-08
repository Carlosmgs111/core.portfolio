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
require("../../../infrastructure/repositories/mongoose");
const models_1 = __importDefault(require("../../../infrastructure/repositories/mongoose/models"));
class DatabaseMongooseService {
    constructor({ __identifier }) {
        this.serviceDescription = "Mongoose Interface Database Service";
        this.create = (Entity) => __awaiter(this, void 0, void 0, function* () {
            const entity = new this.Model(Entity);
            yield entity.save();
            return entity;
        });
        this.findAll = () => __awaiter(this, void 0, void 0, function* () {
            const entities = yield this.Model.find();
            return entities;
        });
        this.findOne = (Entity) => __awaiter(this, void 0, void 0, function* () {
            const entity = yield this.Model.findOne(Entity);
            return entity;
        });
        this.remove = (Entity) => __awaiter(this, void 0, void 0, function* () {
            return yield this.Model.deleteOne(Entity);
        });
        this.update = (Entity) => __awaiter(this, void 0, void 0, function* () {
            const model = yield this.Model.updateOne({ uuid: Entity.uuid }, Entity);
            return model;
        });
        this.Model = models_1.default[__identifier];
    }
    setupModel(__identifier) {
        this.Model = models_1.default[__identifier];
        return this;
    }
    ;
}
exports.default = DatabaseMongooseService;
