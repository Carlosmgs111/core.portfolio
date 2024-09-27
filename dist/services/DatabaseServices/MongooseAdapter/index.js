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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../../../config"));
const mongoose_1 = __importDefault(require("mongoose"));
const utils_1 = require("../../../utils");
const utils_2 = require("../../../utils");
const boom_1 = __importDefault(require("@hapi/boom"));
class MongooseAdapter /* implements DatabaseAdapterType  */ {
    constructor({ url } = {}) {
        this.serviceDescription = "Mongoose Database Service Adapter";
        this.entities = {};
        this.models = {};
        this.createOne = (entity_1, Entity_1, ...args_1) => __awaiter(this, [entity_1, Entity_1, ...args_1], void 0, function* (entity, Entity, options = {}) {
            try {
                yield this.models[entity].create(Entity);
                return { created: true };
            }
            catch (e) {
                console.log(e.message);
                return { created: false };
            }
        });
        this.createMany = (entity, entities, options) => __awaiter(this, void 0, void 0, function* () {
            const entitiesCreated = yield this.models[entity].insertMany(entities);
            return entitiesCreated.map((e) => (Object.assign({}, e._doc)));
        });
        this.findAll = (entity, options) => __awaiter(this, void 0, void 0, function* () {
            const { size = 100, page = 0, related = [], orderBy } = options, restOfOptions = __rest(options, ["size", "page", "related", "orderBy"]);
            const entities = yield this.models[entity]
                .find(this.adapter(restOfOptions))
                .sort(orderBy)
                .skip(Number(page * size))
                .limit(Number(size))
                .populate(this.getPopulateMap(related));
            return entities.map((e) => (Object.assign({}, (0, utils_2.filterAttrs)(e._doc, ["_id", "__v"]))));
        });
        this.howManyOf = (entity_1, ...args_1) => __awaiter(this, [entity_1, ...args_1], void 0, function* (entity, options = {}) {
            return yield this.models[entity]
                .find(this.adapter(options))
                .countDocuments();
        });
        this.findOne = (entity, options) => __awaiter(this, void 0, void 0, function* () {
            const { indexation, related = [] } = options;
            if (!indexation)
                throw boom_1.default.conflict("Indexation must be provided!");
            const entityFounded = yield this.models[entity]
                .findOne(indexation)
                .populate(this.getPopulateMap(related));
            if (!entityFounded)
                return null;
            return (0, utils_2.filterAttrs)(entityFounded._doc, ["_id", "__v"]);
        });
        this.removeOne = (entity, options) => __awaiter(this, void 0, void 0, function* () {
            if (!options.indexation)
                throw boom_1.default.forbidden("Must supply credentials!");
            return (yield this.models[entity].deleteOne(this.adapter(options)))
                .acknowledged;
        });
        this.updateOne = (entity, data, options) => __awaiter(this, void 0, void 0, function* () {
            try {
                const model = yield this.models[entity].updateOne(this.adapter(options), data);
                return model.acknowledged;
            }
            catch (e) {
                return boom_1.default.conflict("Entity with same attribute!");
            }
        });
        this.updateMany = (entity, data, options) => __awaiter(this, void 0, void 0, function* () {
            try {
                const model = yield this.models[entity].updateOne(this.adapter(options), data);
                return model.acknowledged;
            }
            catch (e) {
                return boom_1.default.conflict("Entity with same attribute!");
            }
        });
        this.setOneRelationshipManyToMany = (refs) => __awaiter(this, void 0, void 0, function* () {
            const [from, to] = refs;
            const [exist, { fromModel, toModel, fromLabel, fromQuery, toLabel, toQuery },] = yield this.checkOneRelationshipN2N(from, to);
            if (exist)
                throw boom_1.default.conflict("Entity exist yet!");
            let succesfully = false;
            succesfully = (yield fromModel.updateOne({
                [(0, utils_1.labelCases)(toLabel).CP]: [
                    ...new Set([...fromModel[(0, utils_1.labelCases)(toLabel).CP], toModel._id]),
                ],
            }, {
                uuid: fromQuery,
            })).acknowledged;
            succesfully = (yield toModel.updateOne({
                [(0, utils_1.labelCases)(fromLabel).CP]: [
                    ...new Set([...toModel[(0, utils_1.labelCases)(fromLabel).CP], fromModel._id]),
                ],
            }, {
                uuid: toQuery,
            })).acknowledged;
            return succesfully;
        });
        this.updateOneRelationshipN2N = this.setOneRelationshipManyToMany;
        // TODO rename to removeRelationship
        this.unsetOneRelationshipManyToMany = (refs) => __awaiter(this, void 0, void 0, function* () {
            const [from, to] = refs;
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
            return true;
        });
        this.setOneRelationship2One = (entityObj, refs) => __awaiter(this, void 0, void 0, function* () {
            const relations2One = {};
            const mainLabel = (0, utils_1.Mapfy)(entityObj).keys().next().value;
            const mainQuery = (0, utils_1.Mapfy)(entityObj).values().next().value;
            const { _id } = yield this.models[(0, utils_1.labelCases)(mainLabel).CS].findOne(mainQuery, {
                select: "_id",
            });
            for (let ref of refs) {
                const key = (0, utils_1.Mapfy)(ref).keys().next().value;
                const value = (0, utils_1.Mapfy)(ref).values().next().value;
                const referenced = yield this.models[(0, utils_1.labelCases)(key).CS].findOne(value);
                relations2One[(0, utils_1.labelCases)(key).CS] = referenced._id;
                yield this.models[(0, utils_1.labelCases)(key).CS].updateOne(value, {
                    [(0, utils_1.labelCases)(mainLabel).CP]: [
                        ...referenced[(0, utils_1.labelCases)(mainLabel).CP],
                        _id,
                    ],
                });
            }
            yield this.models[(0, utils_1.labelCases)(mainLabel).CS].updateOne(mainQuery, relations2One);
            return Object.assign(Object.assign({}, entityObj), relations2One);
        });
        // ? Pending to test
        this.unsetOneRelationship2One = (entityObj, refs) => __awaiter(this, void 0, void 0, function* () {
            const mainLabel = (0, utils_1.Mapfy)(entityObj).keys().next().value;
            const mainQuery = (0, utils_1.Mapfy)(entityObj).values().next().value;
            const relations2One = {};
            const Entity = yield this.models[(0, utils_1.labelCases)(mainLabel).CS]
                .findOne(mainQuery)
                .populate(this.getPopulateMap(refs, true));
            for (let ref of refs) {
                const [label] = ref;
                relations2One[(0, utils_1.labelCases)(label).CS] = "";
                const referenced = (yield this.models[(0, utils_1.labelCases)(label).CS]
                    .findOne(Entity[(0, utils_1.labelCases)(label).CS])
                    .select((0, utils_1.labelCases)(mainLabel).CP))[(0, utils_1.labelCases)(mainLabel).CP];
                yield this.models[(0, utils_1.labelCases)(label).CS].updateOne(Entity[(0, utils_1.labelCases)(label).CS], {
                    [(0, utils_1.labelCases)(mainLabel).CP]: [
                        ...referenced.filter((r) => r !== String(Entity._id)),
                    ],
                });
            }
            return Object.assign(Object.assign({}, entityObj), relations2One);
        });
        this.checkOneRelationshipN2N = (from, to) => __awaiter(this, void 0, void 0, function* () {
            const fromLabel = (0, utils_1.Mapfy)(from).keys().next().value;
            const fromQuery = (0, utils_1.Mapfy)(from).values().next().value;
            const toLabel = (0, utils_1.Mapfy)(to).keys().next().value;
            const toQuery = (0, utils_1.Mapfy)(to).values().next().value;
            const fromModel = yield this.models[(0, utils_1.labelCases)(fromLabel).CS].findOne(fromQuery);
            const toModel = yield this.models[(0, utils_1.labelCases)(toLabel).CS].findOne(toQuery);
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
            let { indexation, related } = options;
            return indexation;
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
            yield this.models[entity].updateOne({}, { $unset: options });
        });
        this.close = () => __awaiter(this, void 0, void 0, function* () {
            yield this.connection.close();
        });
        this.dropAllEntities = () => __awaiter(this, void 0, void 0, function* () {
            // await connection.dropDatabase();
            (0, utils_1.Mapfy)(this.models).forEach((model) => {
                model.deleteMany({}, (err) => {
                    if (err) {
                        console.error(err);
                    }
                });
            });
        });
        this.addModel = (modelName, model) => {
            this.models[modelName] = model;
            this.entities = (0, utils_1.setEnums)(Object.entries(this.models).flatMap((m) => m[0]));
        };
        let test = true;
        if (process.argv.includes("DEV") || process.argv.includes("PROD"))
            test = false;
        const localURL = test ? config_1.default.mongoDBTestUrl : config_1.default.mongoDBLocalUrl;
        mongoose_1.default.connect(localURL || config_1.default.mongoDBAtlasURL || "");
        const { connection } = mongoose_1.default;
        this.connection = connection;
        connection.once("open", () => {
            ("Mongodb connection stablished");
        });
        connection.on("error", (err) => {
            process.exit(0);
        });
    }
}
exports.default = MongooseAdapter;
