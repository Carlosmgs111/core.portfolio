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
const models_1 = __importDefault(require("../../../infrastructure/repositories/sequelize/src/models"));
class DatabaseSequelizeService {
    constructor({ __identifier, env }) {
        this.serviceDescription = "Sequelize Interface Database Service";
        this.create = (Entity) => __awaiter(this, void 0, void 0, function* () {
            const entity = yield this.Model.create(Entity);
            return entity;
        });
        this.findAll = () => __awaiter(this, void 0, void 0, function* () {
            const entities = yield this.Model.findAll();
            return entities;
        });
        this.findOne = (Entity) => __awaiter(this, void 0, void 0, function* () {
            yield console.log({ Entity });
            try {
                const entity = yield this.Model.findOne({ where: Entity });
                return entity;
            }
            catch (e) {
                return null;
            }
        });
        this.remove = (Entity) => __awaiter(this, void 0, void 0, function* () {
            return yield this.Model.destroy({ where: { uuid: Entity.uuid } });
        });
        this.update = (Entity) => __awaiter(this, void 0, void 0, function* () {
            console.log({ Entity });
            const model = yield this.Model.update(Entity, {
                where: { uuid: Entity.uuid },
            });
            return model;
        });
        this.syncModels = () => {
            for (var model in models_1.default)
                models_1.default[model].associate ? models_1.default[model].associate(models_1.default) : null;
        };
        this.Model = models_1.default[__identifier];
        this.syncModels();
    }
    setupModel(__identifier) {
        this.Model = models_1.default[__identifier];
        return this;
    }
}
exports.default = DatabaseSequelizeService;
