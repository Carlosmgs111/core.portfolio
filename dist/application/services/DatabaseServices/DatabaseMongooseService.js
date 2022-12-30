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
const utils_1 = require("../../../utils");
const boom_1 = __importDefault(require("@hapi/boom"));
class DatabaseMongooseService {
    constructor({}) {
        this.serviceDescription = "Mongoose Interface Database Service";
        this.create = (Entity, options = {}) => __awaiter(this, void 0, void 0, function* () {
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
            const entity = yield this.Entity.findOne(credentials);
            console.log({ entity });
            return entity;
        });
        this.remove = (Entity) => __awaiter(this, void 0, void 0, function* () {
            return yield this.Entity.deleteOne(this.adapter(Entity));
        });
        this.update = (Entity, options) => __awaiter(this, void 0, void 0, function* () {
            const model = yield this.Entity.updateOne(this.adapter(options), Entity);
            return model;
        });
        // TODO rename to createRelationship
        // ? add a check method that search for a uuid similar to be introduced
        this.relate = (from, to) => __awaiter(this, void 0, void 0, function* () {
            const fromModel = yield models_1.default[(0, utils_1.labelCases)(from.label).CS].findOne({
                uuid: from.uuid,
            });
            const toModel = yield models_1.default[(0, utils_1.labelCases)(to.label).CS].findOne({
                uuid: to.uuid,
            });
            yield fromModel.updateOne({
                [(0, utils_1.labelCases)(to.label).CP]: [
                    ...fromModel[(0, utils_1.labelCases)(to.label).CP],
                    to.uuid,
                ],
            }, {
                uuid: from.uuid,
            });
            yield toModel.updateOne({
                [(0, utils_1.labelCases)(from.label).CP]: [
                    ...toModel[(0, utils_1.labelCases)(from.label).CP],
                    from.uuid,
                ],
            }, {
                uuid: to.uuid,
            });
        });
        // TODO rename to removeRelationship
        this.unrelate = (from, to) => __awaiter(this, void 0, void 0, function* () {
            const fromModel = yield models_1.default[(0, utils_1.labelCases)(from.label).CS].findOne({
                uuid: from.uuid,
            });
            const toModel = yield models_1.default[(0, utils_1.labelCases)(to.label).CS].findOne({
                uuid: to.uuid,
            });
            const fromRelated = fromModel[(0, utils_1.labelCases)(to.label).CP];
            const fromRelatedIndex = fromModel[(0, utils_1.labelCases)(to.label).CP].indexOf(to.uuid);
            const toRelated = toModel[(0, utils_1.labelCases)(from.label).CP];
            const toRelatedIndex = toModel[(0, utils_1.labelCases)(from.label).CP].indexOf(from.uuid);
            if (fromRelatedIndex === -1 || toRelatedIndex === -1)
                throw boom_1.default.internal("Entity related was not found!");
            fromRelated.splice(fromRelatedIndex, 1);
            toRelated.splice(toRelatedIndex, 1);
            yield fromModel.updateOne({
                [(0, utils_1.labelCases)(to.label).CP]: [...fromRelated],
            }, {
                uuid: from.uuid,
            });
            yield toModel.updateOne({
                [(0, utils_1.labelCases)(from.label).CP]: [...toRelated],
            }, {
                uuid: to.uuid,
            });
        });
        this.checkRelationship = ({}, {}) => __awaiter(this, void 0, void 0, function* () { return [true]; });
        this.hasMany = () => { };
        this.adapter = (options) => {
            const { credentials } = options;
            return credentials;
        };
        this.formatIncludeClosure = () => __awaiter(this, void 0, void 0, function* () { });
        this.syncModels = () => { };
        (0, mongoose_1.connect)();
    }
    setupEntity(entityLabel) {
        this.Entity = models_1.default[entityLabel];
        return this;
    }
}
exports.default = DatabaseMongooseService;
