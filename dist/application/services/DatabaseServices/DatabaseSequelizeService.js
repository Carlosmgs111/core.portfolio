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
            return entities;
        });
        this.findOne = (options = {}) => __awaiter(this, void 0, void 0, function* () {
            try {
                const entity = yield this.Entity.findOne(this.adapter(options));
                return entity;
            }
            catch (e) {
                console.log(e.message.red);
                throw boom_1.default.internal(e.message);
            }
        });
        this.remove = (options) => __awaiter(this, void 0, void 0, function* () {
            console.log({ thisAdapter: this.adapter(options) });
            return yield this.Entity.destroy(this.adapter(options));
        });
        this.update = (Entity, options = {}) => __awaiter(this, void 0, void 0, function* () {
            const model = yield this.Entity.update(Entity, this.adapter(options));
            return model;
        });
        this.composeRelationshipLabel = (from, to) => {
            if (models_1.default[`${(0, utils_1.labelCases)(from).CP}_${(0, utils_1.labelCases)(to).CP}`])
                return `${(0, utils_1.labelCases)(from).CP}_${(0, utils_1.labelCases)(to).CP}`;
            if (models_1.default[`${(0, utils_1.labelCases)(to).CP}_${(0, utils_1.labelCases)(from).CP}`])
                return `${(0, utils_1.labelCases)(to).CP}_${(0, utils_1.labelCases)(from).CP}`;
        };
        this.relate = (from, to) => __awaiter(this, void 0, void 0, function* () {
            let relationshipLabel = this.composeRelationshipLabel(from.label, to.label);
            if (!relationshipLabel)
                throw new Error("Invalid labels");
            const data = {
                uuid: (0, uuid_1.v4)(),
                [`${from.label}UUID`]: from.uuid,
                [`${to.label}UUID`]: to.uuid,
            };
            this.setupEntity(relationshipLabel);
            const exist = yield this.findOne({
                credentials: data,
            });
            if (exist)
                throw boom_1.default.conflict("Entity exist yet!");
            const newSupportEntity = yield this.create(data);
            console.log({ newSupportEntity });
            if (!newSupportEntity)
                throw boom_1.default.conflict("Support table doesn't created");
        });
        this.unrelate = (from, to) => __awaiter(this, void 0, void 0, function* () {
            let relationshipLabel = this.composeRelationshipLabel(from.label, to.label);
            if (!relationshipLabel)
                throw new Error("Invalid labels");
            const data = {
                [`${from.label}UUID`]: from.uuid,
                [`${to.label}UUID`]: to.uuid,
            };
            const exist = yield this.setupEntity(relationshipLabel).findOne({
                credentials: data,
            });
            console.log({ exist });
            if (!exist)
                throw boom_1.default.conflict("Entity doesn't exist!");
            return yield this.remove({ credentials: data });
        });
        this.adapter = (OPS) => {
            const { credentials = {}, related = [], size = 100, page = 0, as = null, } = OPS;
            return Object.assign(Object.assign({}, OPS), { where: credentials, include: related, limit: size, offset: page, alias: as });
        };
        // ? Pending to check if it can be implemented as agnosthic way for be using at least with Sequelize and Mongoose
        this.hasMany = (Entity, label) => __awaiter(this, void 0, void 0, function* () { return Entity[`get${label}`](); });
        // * A function that is called in the constructor of the class. It is used to associate the models in
        // * the database.
        this.syncModels = () => {
            for (var model in models_1.default)
                models_1.default[model].associate && models_1.default[model].associate(models_1.default);
        };
        this.syncModels();
    }
    // ? pending to find an appropiated agnosthic name
    getRelated(entitiesToInclude = []) {
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
