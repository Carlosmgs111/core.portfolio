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
const utils_1 = require("../../../utils");
const uuid_1 = require("uuid");
const boom_1 = __importDefault(require("@hapi/boom"));
class SequelizeAdapter {
    // ! Assingment of table in DDBB by use of '__identifier' parameter deprecated, use setModel instead
    constructor({}) {
        this.serviceDescription = "Sequelize Database Service Adapter";
        this.createOne = (entity, Entity, options = {}) => __awaiter(this, void 0, void 0, function* () {
            const newEntity = yield models_1.default[entity].create(Entity, this.adapter(options));
            return newEntity.dataValues;
        });
        this.createMany = (entity, entities, options = {}) => __awaiter(this, void 0, void 0, function* () {
            const entitiesCreated = yield models_1.default[entity].bulkCreate(entities, this.adapter(options));
            return entitiesCreated.map((e) => (Object.assign({}, e.dataValues)));
        });
        this.findAll = (entity, options = {}) => __awaiter(this, void 0, void 0, function* () {
            const entities = yield models_1.default[entity].findAll(this.adapter(options));
            return entities.map((e) => (Object.assign({}, e.dataValues)));
        });
        this.findOne = (entity, options = {}) => __awaiter(this, void 0, void 0, function* () {
            try {
                const entityFounded = yield models_1.default[entity].findOne(this.adapter(options));
                if (!entityFounded)
                    return null;
                return entityFounded.dataValues;
            }
            catch (e) {
                console.log(e.message.red);
                throw boom_1.default.internal(e.message);
            }
        });
        this.removeOne = (entity, options) => __awaiter(this, void 0, void 0, function* () {
            if (!options.credentials)
                throw boom_1.default.forbidden("Must supply credentials for find and delete entity!");
            return yield models_1.default[entity].destroy(this.adapter(options));
        });
        this.updateOne = (entity, Entity, options = {}) => __awaiter(this, void 0, void 0, function* () {
            const updated = yield models_1.default[entity].update(Entity, this.adapter(options));
            return updated.dataValues;
        });
        this.createOneRelationshipN2N = (refs) => __awaiter(this, void 0, void 0, function* () {
            let succesfully = false;
            for (let ref of refs) {
                const [from, to] = ref;
                const [exist, data, relationshipLabel] = yield this.checkOneRelationshipN2N(from, to);
                if (exist)
                    throw boom_1.default.conflict("Entity exist yet!");
                const newSupportEntity = yield this.createOne(relationshipLabel, Object.assign(Object.assign({}, data), { uuid: (0, uuid_1.v4)() }));
                if (!newSupportEntity)
                    throw boom_1.default.conflict("Support table doesn't created");
            }
            return succesfully;
        });
        // TODO rename to removeRelationship
        this.removeOneRelationshipN2N = (refs) => __awaiter(this, void 0, void 0, function* () {
            for (let ref of refs) {
                const [from, to] = ref;
                const [exist, data, relationshipLabel] = yield this.checkOneRelationshipN2N(from, to);
                if (!exist)
                    throw boom_1.default.conflict("Relationship doesn't exist!");
                return Boolean(yield this.removeOne(relationshipLabel, { credentials: data }));
            }
        });
        this.createOneRelationship2One = (entity, refs) => __awaiter(this, void 0, void 0, function* () {
            const relations2One = {};
            for (let ref of refs) {
                const key = (0, utils_1.Mapfy)(ref).keys().next().value;
                const value = (0, utils_1.Mapfy)(ref).values().next().value;
                // console.log({ key, value });
                const referenced = yield models_1.default[(0, utils_1.labelCases)(key).CS].findOne({
                    where: value,
                });
                relations2One[`${key}UUID`] = referenced.uuid;
            }
            const key = (0, utils_1.Mapfy)(entity).keys().next().value;
            const value = (0, utils_1.Mapfy)(entity).values().next().value;
            // console.log({ relations2One });
            // console.log({ key, value });
            models_1.default[(0, utils_1.labelCases)(key).CS].update(relations2One, { where: value });
            return Object.assign(Object.assign({}, entity), relations2One);
        });
        // ? Pending to test
        this.removeOneRelationship2One = (entity, refs) => __awaiter(this, void 0, void 0, function* () {
            const relations2One = {};
            for (let ref of refs) {
                relations2One[`${ref}UUID`] = null;
            }
            return Object.assign(Object.assign({}, entity), relations2One);
        });
        this.checkOneRelationshipN2N = (from, to) => __awaiter(this, void 0, void 0, function* () {
            const composeRelationshipLabel = (from, to) => {
                if (models_1.default[`${(0, utils_1.labelCases)(from).CP}_${(0, utils_1.labelCases)(to).CP}`])
                    return `${(0, utils_1.labelCases)(from).CP}_${(0, utils_1.labelCases)(to).CP}`;
                if (models_1.default[`${(0, utils_1.labelCases)(to).CP}_${(0, utils_1.labelCases)(from).CP}`])
                    return `${(0, utils_1.labelCases)(to).CP}_${(0, utils_1.labelCases)(from).CP}`;
                throw boom_1.default.internal("Invalid labels");
            };
            let relationshipLabel = composeRelationshipLabel(from.label, to.label);
            const relationshipUUIDS = {
                [`${from.label}UUID`]: from.pk,
                [`${to.label}UUID`]: to.pk,
            };
            const exist = yield this.findOne(relationshipLabel, {
                credentials: relationshipUUIDS,
            });
            return [exist, relationshipUUIDS, relationshipLabel];
        });
        this.adapter = (OPS) => {
            const { credentials = {}, related = [], size = 100, page = 0, as = null, } = OPS;
            return Object.assign(Object.assign({}, OPS), { where: credentials, include: this.formatIncludeClosure(related), limit: Number(size), offset: Number(page), alias: as });
        };
        // * A function that is called in the constructor of the class. It is used to associate the models in
        // * the database.
        this.syncModels = () => {
            for (var model in models_1.default)
                models_1.default[model].associate && models_1.default[model].associate(models_1.default);
        };
        this.entities = (0, utils_1.setEnums)(Object.entries(models_1.default).flatMap((m) => m[0]));
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
                model: models_1.default[model],
                as: as || (0, utils_1.labelCases)(model)[singular ? "CS" : "CP"],
                attributes,
                where,
            });
        });
        return include;
    }
}
exports.default = SequelizeAdapter;
