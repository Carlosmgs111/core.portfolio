"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoryService = exports.CommandService = exports.QueryService = void 0;
const DatabaseServices_1 = require("../DatabaseServices");
console.log({ DatabaseService: DatabaseServices_1.DatabaseService });
exports.QueryService = (0, DatabaseServices_1.DatabaseService)(DatabaseServices_1.Adapters.MongooseAdapter);
exports.CommandService = (0, DatabaseServices_1.DatabaseService)(DatabaseServices_1.Adapters.SequelizeAdapter);
exports.RepositoryService = {
    query: exports.QueryService,
    command: exports.CommandService,
    info: () => {
        return "Repository Service";
    },
};
