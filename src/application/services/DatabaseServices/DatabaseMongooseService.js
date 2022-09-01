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
        this.create = (Entity) => __awaiter(this, void 0, void 0, function* () {
            const Model = models_1.default[this.__identifier];
            const entity = new Model(Entity);
            yield entity.save();
            return entity;
        });
        this.findAll = () => __awaiter(this, void 0, void 0, function* () {
            const Model = models_1.default[this.__identifier];
            const entities = yield Model.find();
            return entities;
        });
        this.findOne = (Entity) => __awaiter(this, void 0, void 0, function* () {
            const Model = models_1.default[this.__identifier];
            const entity = yield Model.findOne(Entity);
            return entity;
        });
        this.remove = (Entity) => __awaiter(this, void 0, void 0, function* () {
            const Model = models_1.default[this.__identifier];
            return yield Model.deleteOne(Entity);
        });
        this.update = (Entity) => __awaiter(this, void 0, void 0, function* () {
            const Model = models_1.default[this.__identifier];
            const model = yield Model.updateOne({ uuid: Entity.uuid }, Entity);
            return model;
        });
        this.setup = (__identifier) => this.__identifier = __identifier;
        this.__identifier = __identifier;
    }
}
exports.default = DatabaseMongooseService;
