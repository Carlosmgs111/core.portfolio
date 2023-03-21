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
const infrastructure_1 = require("./infrastructure");
const models_1 = __importDefault(require("./infrastructure/models"));
const utils_1 = require("../../../utils");
const utils_2 = require("../../../utils");
const boom_1 = __importDefault(require("@hapi/boom"));
class MongooseAdapter /* implements DatabaseAdapter */ {
    constructor({}) {
        this.serviceDescription = "Mongoose Database Service Adapter";
        this.createOne = (entity, Entity, options = {}) => __awaiter(this, void 0, void 0, function* () {
            let newEntity = yield models_1.default[entity].create(Entity);
            return newEntity._doc;
        });
        this.createMany = (entity, entities, options) => __awaiter(this, void 0, void 0, function* () {
            const entitiesCreated = yield models_1.default[entity].insertMany(entities);
            return entitiesCreated.map((e) => (Object.assign({}, e._doc)));
        });
        this.findAll = (entity, options) => __awaiter(this, void 0, void 0, function* () {
            const { size = 100, page = 0, related = [] } = options;
            const entities = yield models_1.default[entity]
                .find(this.adapter(options))
                .populate(this.getPopulateMap(related))
                .limit(Number(size))
                .skip(Number(page));
            return entities.map((e) => (Object.assign({}, (0, utils_2.filterAttrs)(e._doc, ["_id", "__v"]))));
        });
        this.findOne = (entity, options) => __awaiter(this, void 0, void 0, function* () {
            const { credentials, related = [] } = options;
            if (!credentials)
                throw boom_1.default.conflict("Idexation must be provided!");
            const entityFounded = yield models_1.default[entity]
                .findOne(credentials)
                .populate(this.getPopulateMap(related));
            if (!entityFounded)
                return null;
            return (0, utils_2.filterAttrs)(entityFounded._doc, ["_id", "__v"]);
        });
        this.removeOne = (entity, options) => __awaiter(this, void 0, void 0, function* () {
            if (!options.credentials)
                throw boom_1.default.forbidden("Must supply credentials for find and delete entity!");
            return yield models_1.default[entity].deleteOne(this.adapter(options));
        });
        this.updateOne = (entity, Entity, options) => __awaiter(this, void 0, void 0, function* () {
            try {
                const model = yield models_1.default[entity].updateOne(this.adapter(options), Entity);
                return model._doc;
            }
            catch (e) {
                return boom_1.default.conflict("Entity with same attribute!");
            }
        });
        this.createOneRelationshipN2N = (refs) => __awaiter(this, void 0, void 0, function* () {
            for (let ref of refs) {
                const [from, to] = ref;
                const [exist, { fromModel, toModel, fromLabel, fromQuery, toLabel, toQuery },] = yield this.checkOneRelationshipN2N(from, to);
                if (exist)
                    throw boom_1.default.conflict("Entity exist yet!");
                yield fromModel.updateOne({
                    [(0, utils_1.labelCases)(toLabel).CP]: [
                        ...fromModel[(0, utils_1.labelCases)(toLabel).CP],
                        toModel._id,
                    ],
                }, {
                    uuid: fromQuery,
                });
                yield toModel.updateOne({
                    [(0, utils_1.labelCases)(fromLabel).CP]: [
                        ...toModel[(0, utils_1.labelCases)(fromLabel).CP],
                        fromModel._id,
                    ],
                }, {
                    uuid: toQuery,
                });
            }
        });
        this.updateOneRelationshipN2N = this.createOneRelationshipN2N;
        // TODO rename to removeRelationship
        this.removeOneRelationshipN2N = (refs) => __awaiter(this, void 0, void 0, function* () {
            for (let ref of refs) {
                const [from, to] = ref;
                const [exist, { fromModel, toModel, fromRelated, toRelated, fromRelatedIndex, toRelatedIndex, fromLabel, toLabel, fromQuery, toQuery, },] = yield this.checkOneRelationshipN2N(from, to);
                if (!exist)
                    throw boom_1.default.conflict("Entity doesn't exist!");
                if (fromRelatedIndex === -1 || toRelatedIndex === -1)
                    return false;
                fromRelated.splice(fromRelatedIndex, 1);
                toRelated.splice(toRelatedIndex, 1);
                yield fromModel.updateOne({
                    [(0, utils_1.labelCases)(toLabel).CP]: [...fromRelated],
                }, {
                    uuid: fromQuery,
                });
                yield toModel.updateOne({
                    [(0, utils_1.labelCases)(fromLabel).CP]: [...toRelated],
                }, {
                    uuid: toQuery,
                });
            }
            return true;
        });
        this.setOneRelationship2One = (entity, refs) => __awaiter(this, void 0, void 0, function* () {
            const relations2One = {};
            const mainLabel = (0, utils_1.Mapfy)(entity).keys().next().value;
            const mainQuery = (0, utils_1.Mapfy)(entity).values().next().value;
            const { _id } = yield models_1.default[(0, utils_1.labelCases)(mainLabel).CS].findOne(mainQuery, {
                select: "_id",
            });
            for (let ref of refs) {
                const key = (0, utils_1.Mapfy)(ref).keys().next().value;
                const value = (0, utils_1.Mapfy)(ref).values().next().value;
                const referenced = yield models_1.default[(0, utils_1.labelCases)(key).CS].findOne(value);
                relations2One[(0, utils_1.labelCases)(key).CS] = referenced._id;
                yield models_1.default[(0, utils_1.labelCases)(key).CS].updateOne(value, {
                    [(0, utils_1.labelCases)(mainLabel).CP]: [
                        ...referenced[(0, utils_1.labelCases)(mainLabel).CP],
                        _id,
                    ],
                });
            }
            yield models_1.default[(0, utils_1.labelCases)(mainLabel).CS].updateOne(mainQuery, relations2One);
            return Object.assign(Object.assign({}, entity), relations2One);
        });
        // ? Pending to test
        this.unsetOneRelationship2One = (entity, refs) => __awaiter(this, void 0, void 0, function* () {
            const mainLabel = (0, utils_1.Mapfy)(entity).keys().next().value;
            const mainQuery = (0, utils_1.Mapfy)(entity).values().next().value;
            const relations2One = {};
            const Entity = yield models_1.default[(0, utils_1.labelCases)(mainLabel).CS]
                .findOne(mainQuery)
                .populate(this.getPopulateMap(refs, true));
            for (let ref of refs) {
                const [label] = ref;
                relations2One[(0, utils_1.labelCases)(label).CS] = "";
                const referenced = (yield models_1.default[(0, utils_1.labelCases)(label).CS]
                    .findOne(Entity[(0, utils_1.labelCases)(label).CS])
                    .select((0, utils_1.labelCases)(mainLabel).CP))[(0, utils_1.labelCases)(mainLabel).CP];
                yield models_1.default[(0, utils_1.labelCases)(label).CS].updateOne(Entity[(0, utils_1.labelCases)(label).CS], {
                    [(0, utils_1.labelCases)(mainLabel).CP]: [
                        ...referenced.filter((r) => r !== String(Entity._id)),
                    ],
                });
            }
            return Object.assign(Object.assign({}, entity), relations2One);
        });
        this.checkOneRelationshipN2N = (from, to) => __awaiter(this, void 0, void 0, function* () {
            const fromLabel = (0, utils_1.Mapfy)(from).keys().next().value;
            const fromQuery = (0, utils_1.Mapfy)(from).values().next().value;
            const toLabel = (0, utils_1.Mapfy)(to).keys().next().value;
            const toQuery = (0, utils_1.Mapfy)(to).values().next().value;
            const fromModel = yield models_1.default[(0, utils_1.labelCases)(fromLabel).CS].findOne(fromQuery);
            const toModel = yield models_1.default[(0, utils_1.labelCases)(toLabel).CS].findOne(toQuery);
            const fromRelated = fromModel[(0, utils_1.labelCases)(toLabel).CP];
            const fromRelatedIndex = fromModel[(0, utils_1.labelCases)(toLabel).CP].indexOf(toModel._id);
            const toRelated = toModel[(0, utils_1.labelCases)(fromLabel).CP];
            const toRelatedIndex = toModel[(0, utils_1.labelCases)(fromLabel).CP].indexOf(fromModel._id);
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
                    fromLabel,
                    toLabel,
                    fromQuery,
                    toQuery,
                },
            ];
        });
        this.adapter = (options) => {
            let { credentials, related } = options;
            return credentials;
        };
        this.getPopulateMap = (related, include_id = false) => {
            const populates = [];
            related.forEach((r) => {
                const [label, { as = null, attributes = [], credentials = {} } = {}] = r;
                let select = `${include_id ? "_id " : "-_id "}`; // ? for exclude _id attribute
                attributes.forEach((a) => (select += `${a} `));
                populates.push({
                    path: as || (0, utils_1.labelCases)(label).CP,
                    select,
                });
            });
            return populates;
        };
        this.removeAttribute = (entity, options) => __awaiter(this, void 0, void 0, function* () {
            yield models_1.default[entity].update({}, { $unset: options });
        });
        this.entities = (0, utils_1.setEnums)(Object.entries(models_1.default).flatMap((m) => m[0]));
        (0, infrastructure_1.connect)();
    }
}
exports.default = MongooseAdapter;
