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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoryService = exports.CommandService = exports.QueryService = void 0;
const DatabaseServices_1 = require("../DatabaseServices");
console.log({ DatabaseService: DatabaseServices_1.DatabaseService });
exports.QueryService = (0, DatabaseServices_1.DatabaseService)(DatabaseServices_1.Adapters.MongooseAdapter);
exports.CommandService = (0, DatabaseServices_1.DatabaseService)(DatabaseServices_1.Adapters.SequelizeAdapter);
exports.RepositoryService = {
    create: (entity, Entity, options = {}) => __awaiter(void 0, void 0, void 0, function* () {
        exports.QueryService.create(entity, Entity, options);
        return yield exports.CommandService.create(entity, Entity, options);
    }),
    createMany: (entity, entities, options = {}) => __awaiter(void 0, void 0, void 0, function* () {
        console.log({
            query: yield exports.QueryService.createMany(entity, entities, options),
        });
        return yield exports.CommandService.createMany(entity, entities, options);
    }),
    findOne: (entity, options = {}) => __awaiter(void 0, void 0, void 0, function* () {
        return yield exports.QueryService.findOne(entity, options);
    }),
    findAll: (entity, options = {}) => __awaiter(void 0, void 0, void 0, function* () {
        return yield exports.QueryService.findAll(entity, options);
    }),
    remove: (entity, options) => __awaiter(void 0, void 0, void 0, function* () {
        exports.QueryService.remove(entity, options);
        return yield exports.CommandService.remove(entity, options);
    }),
    update: (entity, Entity, options = {}) => __awaiter(void 0, void 0, void 0, function* () {
        exports.QueryService.update(entity, Entity, options);
        return yield exports.CommandService.update(entity, Entity, options);
    }),
    relateN2N: (refs) => __awaiter(void 0, void 0, void 0, function* () {
        exports.QueryService.relateN2N(refs);
        return yield exports.CommandService.relateN2N(refs);
    }),
    relate2One: (entity, refs) => __awaiter(void 0, void 0, void 0, function* () {
        exports.QueryService.relate2One(entity, refs);
        return yield exports.CommandService.relate2One(entity, refs);
    }),
    unrelateN2N: (refs) => __awaiter(void 0, void 0, void 0, function* () {
        exports.QueryService.unrelateN2N(refs);
        return yield exports.CommandService.unrelateN2N(refs);
    }),
    checkRelationship: exports.CommandService.checkRelationship,
    entities: Object.assign(Object.assign({}, exports.CommandService.entities), exports.QueryService.entities),
    setupEntity: exports.CommandService.setupEntity,
    info: () => {
        return "Repository Service";
    },
};
