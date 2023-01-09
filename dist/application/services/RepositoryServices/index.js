"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoryService = exports.CommandService = exports.QueryService = void 0;
const DatabaseServices_1 = require("../DatabaseServices");
console.log({ DatabaseService: DatabaseServices_1.DatabaseService });
exports.QueryService = (0, DatabaseServices_1.DatabaseService)(DatabaseServices_1.Adapters.MongooseAdapter);
exports.CommandService = (0, DatabaseServices_1.DatabaseService)(DatabaseServices_1.Adapters.SequelizeAdapter);
exports.RepositoryService = {
    create: exports.CommandService.create,
    createMany: exports.CommandService.createMany,
    findOne: exports.QueryService.findOne,
    findAll: exports.QueryService.findAll,
    remove: exports.CommandService.remove,
    update: exports.CommandService.update,
    relateN2N: exports.CommandService.relateN2N,
    relate2One: exports.CommandService.relate2One,
    unrelateN2N: exports.CommandService.unrelateN2N,
    checkRelationship: exports.CommandService.checkRelationship,
    entities: Object.assign(Object.assign({}, exports.CommandService.entities), exports.QueryService.entities),
    setupEntity: exports.CommandService.setupEntity,
    info: () => {
        return "Repository Service";
    },
};
