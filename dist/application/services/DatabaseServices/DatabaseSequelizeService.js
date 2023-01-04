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
class DatabaseSequelizeService {
    // ! Assingment of table in DDBB by use of '__identifier' parameter deprecated, use setModel instead
    constructor({}) {
        this.serviceDescription = "Sequelize Interface Database Service";
        this.create = (Entity, options = {}) => __awaiter(this, void 0, void 0, function* () {
            const entity = yield this.Entity.create(Entity, this.adapter(options));
            return entity;
        });
        this.findAll = (options = {}) => __awaiter(this, void 0, void 0, function* () {
            const entities = yield this.Entity.findAll(this.adapter(options));
            return entities.map((e) => (Object.assign({}, e.dataValues)));
        });
        this.findOne = (options = {}) => __awaiter(this, void 0, void 0, function* () {
            try {
                const entity = yield this.Entity.findOne(this.adapter(options));
                if (!entity)
                    return null;
                return entity.dataValues;
            }
            catch (e) {
                console.log(e.message.red);
                throw boom_1.default.internal(e.message);
            }
        });
        this.remove = (options) => __awaiter(this, void 0, void 0, function* () {
            if (!options.credentials)
                throw boom_1.default.forbidden("Must supply credentials for find and delete entity!");
            return yield this.Entity.destroy(this.adapter(options));
        });
        this.update = (Entity, options = {}) => __awaiter(this, void 0, void 0, function* () {
            const model = yield this.Entity.update(Entity, this.adapter(options));
            return model.dataValues;
        });
        // TODO rename to createRelationship
        this.relateN2N = (from, to) => __awaiter(this, void 0, void 0, function* () {
            const [exist, data] = yield this.checkRelationship(from, to);
            if (exist)
                throw boom_1.default.conflict("Entity exist yet!");
            const newSupportEntity = yield this.create(Object.assign(Object.assign({}, data), { uuid: (0, uuid_1.v4)() }));
            if (!newSupportEntity)
                throw boom_1.default.conflict("Support table doesn't created");
        });
        // TODO rename to removeRelationship
        this.unrelateN2N = (from, to) => __awaiter(this, void 0, void 0, function* () {
            const [exist, data] = yield this.checkRelationship(from, to);
            if (!exist)
                throw boom_1.default.conflict("Relationship doesn't exist!");
            return yield this.remove({ credentials: data });
        });
        this.relate2One = (entity, refs) => __awaiter(this, void 0, void 0, function* () {
            const relations2One = {};
            for (let ref of refs) {
                const key = (0, utils_1.Mapfy)(ref).keys().next().value;
                const value = (0, utils_1.Mapfy)(ref).values().next().value;
                const referenced = yield models_1.default[(0, utils_1.labelCases)(key).CS].findOne({
                    where: value,
                });
                relations2One[`${key}UUID`] = referenced.uuid;
            }
            return Object.assign(Object.assign({}, entity), relations2One);
        });
        this.checkRelationship = (from, to) => __awaiter(this, void 0, void 0, function* () {
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
            const exist = yield this.setupEntity(relationshipLabel).findOne({
                credentials: relationshipUUIDS,
            });
            return [exist, relationshipUUIDS];
        });
        // ? Pending to check if it can be implemented as agnosthic way for be using at least with Sequelize and Mongoose
        this.hasMany = (Entity, label) => __awaiter(this, void 0, void 0, function* () { return Entity[`get${label}`](); });
        this.adapter = (OPS) => {
            console.log({ OPS });
            const { credentials = {}, related = [], size = 100, page = 0, as = null, } = OPS;
            return Object.assign(Object.assign({}, OPS), { where: credentials, include: this.formatIncludeClosure(related), limit: Number(size), offset: Number(page), alias: as });
        };
        // * A function that is called in the constructor of the class. It is used to associate the models in
        // * the database.
        this.syncModels = () => {
            for (var model in models_1.default)
                models_1.default[model].associate && models_1.default[model].associate(models_1.default);
        };
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
    setupEntity(entityLabel) {
        this.Entity = models_1.default[entityLabel];
        return this;
    }
}
exports.default = DatabaseSequelizeService;
