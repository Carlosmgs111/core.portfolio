"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoryService = void 0;
const DatabaseServices_1 = require("../DatabaseServices");
console.log({ DatabaseService: DatabaseServices_1.DatabaseService });
const QueryService = (0, DatabaseServices_1.DatabaseService)(DatabaseServices_1.Adapters.Mongoose);
const CommandService = (0, DatabaseServices_1.DatabaseService)(DatabaseServices_1.Adapters.Sequelize);
const RepositoryService = {
    create: CommandService.create,
    createMany: CommandService.createMany,
    findOne: QueryService.findOne,
    findAll: QueryService.findAll,
    remove: CommandService.remove,
    update: CommandService.update,
    relateN2N: CommandService.relateN2N,
    unrelateN2N: CommandService.unrelateN2N,
    relate2One: CommandService.unrelate2One,
    checkRelationship: CommandService.checkRelationship,
    setupEntity: CommandService.setupEntity,
    info: () => {
        return "Repository Service";
    },
};
exports.RepositoryService = RepositoryService;
