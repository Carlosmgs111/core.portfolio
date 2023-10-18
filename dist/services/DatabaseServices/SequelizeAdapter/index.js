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
const models_1 = require("./infrastructure/models");
const infrastructure_1 = require("./infrastructure");
const utils_1 = require("../../../utils");
const uuid_1 = require("uuid");
const boom_1 = __importDefault(require("@hapi/boom"));
class SequelizeAdapter {
    constructor({} = {}) {
        this.serviceDescription = "Sequelize Database Service Adapter";
        this.createOne = (entity, Entity, options = {}) => __awaiter(this, void 0, void 0, function* () {
            const newEntity = yield models_1.models[entity].create(Entity, this.adapter(options));
            return newEntity.dataValues;
        });
        this.createMany = (entity, entities, options = {}) => __awaiter(this, void 0, void 0, function* () {
            const entitiesCreated = yield models_1.models[entity].bulkCreate(entities, this.adapter(options));
            return entitiesCreated.map((e) => (Object.assign({}, e.dataValues)));
        });
        this.findAll = (entity, options = {}) => __awaiter(this, void 0, void 0, function* () {
            const entities = yield models_1.models[entity].findAll(this.adapter(options));
            return entities.map((e) => (Object.assign({}, e.dataValues)));
        });
        this.findOne = (entity, options = {}) => __awaiter(this, void 0, void 0, function* () {
            try {
                const entityFounded = yield models_1.models[entity].findOne(this.adapter(options));
                if (!entityFounded)
                    return null;
                return entityFounded.dataValues;
            }
            catch (e) {
                e.message.red;
                throw boom_1.default.internal(e.message);
            }
        });
        this.removeOne = (entity, options) => __awaiter(this, void 0, void 0, function* () {
            if (!options.credentials)
                throw boom_1.default.forbidden("Must supply credentials for find and delete entity!");
            return yield models_1.models[entity].destroy(this.adapter(options));
        });
        this.updateOne = (entity, Entity, options = {}) => __awaiter(this, void 0, void 0, function* () {
            const updated = yield models_1.models[entity].update(Entity, this.adapter(options));
            return this.getResult(updated);
        });
        this.createOneRelationshipN2N = (refs) => __awaiter(this, void 0, void 0, function* () {
            let succesfully = false;
            for (let ref of refs) {
                const [from, to] = ref;
                const [existed, data, relationshipLabel] = yield this.checkOneRelationshipN2N(from, to);
                if (existed)
                    throw boom_1.default.conflict("Entity existed yet!");
                const newSupportEntity = yield this.createOne(relationshipLabel, Object.assign(Object.assign({}, data), { uuid: (0, uuid_1.v4)() }));
                if (!newSupportEntity)
                    throw boom_1.default.conflict("Support table doesn't created");
            }
            return succesfully;
        });
        this.updateOneRelationshipN2N = (refs) => __awaiter(this, void 0, void 0, function* () {
            let succesfully = false;
            for (let ref of refs) {
                const [from, to] = ref;
                const [existed, data, relationshipLabel] = yield this.checkOneRelationshipN2N(from, to);
                if (!existed)
                    throw boom_1.default.conflict("Relationship doesn't existed!");
                const updatedEntity = yield this.updateOne(relationshipLabel, Object.assign({}, data));
                if (!updatedEntity)
                    throw boom_1.default.conflict("Support table doesn't created");
            }
            return succesfully;
        });
        // TODO rename to removeRelationship
        this.removeOneRelationshipN2N = (refs) => __awaiter(this, void 0, void 0, function* () {
            for (let ref of refs) {
                const [from, to] = ref;
                const [existed, data, relationshipLabel] = yield this.checkOneRelationshipN2N(from, to);
                if (!existed)
                    throw boom_1.default.conflict("Relationship doesn't existed!");
                return Boolean(yield this.removeOne(relationshipLabel, { credentials: data }));
            }
        });
        this.setOneRelationship2One = (entity, refs) => __awaiter(this, void 0, void 0, function* () {
            const mainLabel = (0, utils_1.Mapfy)(entity).keys().next().value;
            const mainQuery = (0, utils_1.Mapfy)(entity).values().next().value;
            const relations2One = {};
            for (let ref of refs) {
                const label = (0, utils_1.Mapfy)(ref).keys().next().value;
                const query = (0, utils_1.Mapfy)(ref).values().next().value;
                // ({ label, query });
                const referenced = yield models_1.models[(0, utils_1.labelCases)(label).CS].findOne({
                    where: query,
                });
                relations2One[`${label}UUID`] = referenced.uuid;
            }
            models_1.models[(0, utils_1.labelCases)(mainLabel).CS].update(relations2One, {
                where: mainQuery,
            });
            return Object.assign(Object.assign({}, entity), relations2One);
        });
        // ? Pending to test
        this.unsetOneRelationship2One = (entity, refs) => __awaiter(this, void 0, void 0, function* () {
            const relations2One = {};
            for (let ref of refs) {
                relations2One[`${ref}UUID`] = null;
            }
            return Object.assign(Object.assign({}, entity), relations2One);
        });
        this.checkOneRelationshipN2N = (from, to) => __awaiter(this, void 0, void 0, function* () {
            const composeRelationshipLabel = (from, to) => {
                if (models_1.models[`${(0, utils_1.labelCases)(from).CP}_${(0, utils_1.labelCases)(to).CP}`])
                    return `${(0, utils_1.labelCases)(from).CP}_${(0, utils_1.labelCases)(to).CP}`;
                if (models_1.models[`${(0, utils_1.labelCases)(to).CP}_${(0, utils_1.labelCases)(from).CP}`])
                    return `${(0, utils_1.labelCases)(to).CP}_${(0, utils_1.labelCases)(from).CP}`;
                throw boom_1.default.internal("Invalid labels");
            };
            const fromLabel = (0, utils_1.Mapfy)(from).keys().next().value;
            const fromQuery = (0, utils_1.Mapfy)(from).values().next().value;
            const toLabel = (0, utils_1.Mapfy)(to).keys().next().value;
            const toQuery = (0, utils_1.Mapfy)(to).values().next().value;
            const { uuid: fromUUID } = yield models_1.models[(0, utils_1.labelCases)(fromLabel).CS].findOne({
                where: fromQuery,
                attributes: ["uuid"],
            });
            const { uuid: toUUID } = yield models_1.models[(0, utils_1.labelCases)(toLabel).CS].findOne({
                where: toQuery,
                attributes: ["uuid"],
            });
            let relationshipLabel = composeRelationshipLabel(fromLabel, toLabel);
            const relationshipUUIDS = {
                [`${fromLabel}UUID`]: fromUUID,
                [`${toLabel}UUID`]: toUUID,
            };
            const existed = yield this.findOne(relationshipLabel, {
                credentials: relationshipUUIDS,
            });
            return [existed, relationshipUUIDS, relationshipLabel];
        });
        this.adapter = (OPS) => {
            const { credentials = {}, related = [], size = 100, page = 0, as = null, } = OPS;
            return Object.assign(Object.assign({}, OPS), { where: credentials, include: this.formatIncludeClosure(related), limit: Number(size), offset: Number(page), alias: as });
        };
        this.getResult = (result) => {
            if (Array.isArray(result))
                return result.map((o) => Boolean(o)).includes(true);
        };
        // * A function that is called in the constructor of the class. It is used to associate the models in
        // * the database.
        this.syncModels = () => __awaiter(this, void 0, void 0, function* () {
            for (var model in models_1.models) {
                models_1.models[model].associate && (yield models_1.models[model].associate(models_1.models));
            }
        });
        this.entities = (0, utils_1.setEnums)(Object.entries(models_1.models).flatMap((m) => m[0]));
        this.close = () => __awaiter(this, void 0, void 0, function* () {
            yield infrastructure_1.sequelize.close();
        });
        this.dropAllEntities = () => __awaiter(this, void 0, void 0, function* () {
            yield infrastructure_1.sequelize.sync({ force: true });
        });
        this.syncModels();
    }
    // ? pending to find an appropiated agnosthic name
    formatIncludeClosure(entitiesToInclude = []) {
        const include = [];
        entitiesToInclude.forEach((e) => {
            const [model, queryOps = {}, options = {}] = e;
            const { singular = false } = options;
            const { attributes = null, where = {}, as = null, } = this.adapter(queryOps);
            include.push({
                model: models_1.models[model],
                as: as || (0, utils_1.labelCases)(model)[singular ? "CS" : "CP"],
                attributes,
                where,
            });
        });
        return include;
    }
}
exports.default = SequelizeAdapter;
