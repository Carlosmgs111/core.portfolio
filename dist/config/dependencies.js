"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uiConfig = exports.apiConfig = exports.AuthServices = exports.DatabaseService = void 0;
const services_1 = require("../application/services");
console.log({ RepositoryService: services_1.RepositoryService });
exports.DatabaseService = services_1.RepositoryService; /* DBS(
  //Adapters.MongooseAdapter
); */
exports.AuthServices = new services_1.AuthServices();
const apiVersions = ["v1"];
const uiVersions = ["v1"];
exports.apiConfig = {
    versions: apiVersions,
    version: apiVersions[apiVersions.length - 1],
};
exports.uiConfig = {
    versions: uiVersions,
    version: uiVersions[uiVersions.length - 1],
};
