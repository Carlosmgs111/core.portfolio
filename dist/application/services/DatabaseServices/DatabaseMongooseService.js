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
console.log({ models: models_1.default });
class DatabaseMongooseService {
    constructor({}) {
        this.serviceDescription = "Mongoose Interface Database Service";
        this.create = (Entity, options = {}) => __awaiter(this, void 0, void 0, function* () {
            const entity = new this.Entity(Entity);
            yield entity.save();
            return entity;
        });
        this.findAll = (options) => __awaiter(this, void 0, void 0, function* () {
            const { size = 100, page = 0 } = options;
            console.log({ size, page });
            const { related = [] } = options;
            const entities = yield this.Entity.find(this.adapter(options))
                .populate(this.getPopulateMap(related))
                .limit(Number(size))
                .skip(Number(page));
            return entities.map((e) => (Object.assign({}, e._doc)));
        });
        this.findOne = (options) => __awaiter(this, void 0, void 0, function* () {
            const { credentials, related = [] } = options;
            const entity = yield this.Entity.findOne(credentials)
                .populate(this.getPopulateMap(related));
            if (!entity)
                return null;
            return entity._doc;
        });
        this.remove = (options) => __awaiter(this, void 0, void 0, function* () {
            return yield this.Entity.deleteOne(this.adapter(options));
        });
        this.update = (Entity, options) => __awaiter(this, void 0, void 0, function* () {
            const model = yield this.Entity.updateOne(this.adapter(options), Entity);
            return model._doc;
        });
        // TODO rename to createRelationship
        // ? add a check method that search for a uuid similar to be introduced
        this.relateN2N = (from, to) => __awaiter(this, void 0, void 0, function* () {
            const [exist, { fromModel, toModel }] = yield this.checkRelationship(from, to);
            if (exist)
                throw boom_1.default.conflict("Entity exist yet!");
            yield fromModel.updateOne({
                [(0, utils_1.labelCases)(to.label).CP]: [
                    ...fromModel[(0, utils_1.labelCases)(to.label).CP],
                    toModel._id,
                ],
            }, {
                uuid: from.pk,
            });
            yield toModel.updateOne({
                [(0, utils_1.labelCases)(from.label).CP]: [
                    ...toModel[(0, utils_1.labelCases)(from.label).CP],
                    fromModel._id,
                ],
            }, {
                uuid: to.pk,
            });
        });
        // TODO rename to removeRelationship
        this.unrelateN2N = (from, to) => __awaiter(this, void 0, void 0, function* () {
            const [exist, { fromModel, toModel, fromRelated, toRelated, fromRelatedIndex, toRelatedIndex, },] = yield this.checkRelationship(from, to);
            if (!exist)
                throw boom_1.default.conflict("Entity exist yet!");
            fromRelated.splice(fromRelatedIndex, 1);
            toRelated.splice(toRelatedIndex, 1);
            yield fromModel.updateOne({
                [(0, utils_1.labelCases)(to.label).CP]: [...fromRelated],
            }, {
                uuid: from.pk,
            });
            yield toModel.updateOne({
                [(0, utils_1.labelCases)(from.label).CP]: [...toRelated],
            }, {
                uuid: to.pk,
            });
        });
        this.relate2One = (entity, refs) => __awaiter(this, void 0, void 0, function* () {
            const relations2One = {};
            for (let ref of refs) {
                const key = (0, utils_1.Mapfy)(ref).keys().next().value;
                const value = (0, utils_1.Mapfy)(ref).values().next().value;
                const referenced = yield models_1.default[(0, utils_1.labelCases)(key).CS].findOne(value);
                relations2One[(0, utils_1.labelCases)(key).CS] = referenced._id;
            }
            return Object.assign(Object.assign({}, entity), relations2One);
        });
        this.checkRelationship = (from, to) => __awaiter(this, void 0, void 0, function* () {
            const fromModel = yield models_1.default[(0, utils_1.labelCases)(from.label).CS].findOne({
                uuid: from.pk,
            });
            const toModel = yield models_1.default[(0, utils_1.labelCases)(to.label).CS].findOne({
                uuid: to.pk,
            });
            const fromRelated = fromModel[(0, utils_1.labelCases)(to.label).CP];
            const fromRelatedIndex = fromModel[(0, utils_1.labelCases)(to.label).CP].indexOf(toModel._id);
            const toRelated = toModel[(0, utils_1.labelCases)(from.label).CP];
            const toRelatedIndex = toModel[(0, utils_1.labelCases)(from.label).CP].indexOf(fromModel._id);
            const exist = fromRelatedIndex !== -1 || toRelatedIndex !== -1;
            return [
                exist,
                {
                    fromModel,
                    toModel,
                    fromRelated,
                    toRelated,
                    fromRelatedIndex,
                    toRelatedIndex,
                },
            ];
        });
        this.hasMany = () => { };
        this.adapter = (options) => {
            const { credentials, related } = options;
            return credentials;
        };
        this.getPopulateMap = (related) => {
            const populates = [];
            related.forEach((r) => {
                const [label, { as = null, attributes = [] } = {}] = r;
                let select = "-_id"; // ? for exclude _id attribute
                attributes.forEach((a) => (select += `${a} `));
                populates.push({ path: as || (0, utils_1.labelCases)(label).CP, select });
            });
            return populates;
        };
        this.formatIncludeClosure = (entitiesToInclude) => __awaiter(this, void 0, void 0, function* () { });
        this.syncModels = () => { };
        (0, mongoose_1.connect)();
    }
    setupEntity(entityLabel) {
        this.Entity = models_1.default[entityLabel];
        return this;
    }
}
exports.default = DatabaseMongooseService;
