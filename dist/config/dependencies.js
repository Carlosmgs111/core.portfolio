"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uiConfig = exports.apiConfig = exports.SocketService = exports.AuthServices = exports.RepositoryService = exports.TaskMessageService = void 0;
const DatabaseServices_1 = require("../services/DatabaseServices");
const services_1 = require("../services");
const repositoryServices = {
    CQRS: () => new services_1.CQRSService(),
    DBS: () => (0, services_1.DatabaseService)(DatabaseServices_1.Adapters.MongooseAdapter),
};
exports.TaskMessageService = new services_1.TaskMessageService();
exports.RepositoryService = repositoryServices.CQRS();
exports.AuthServices = new services_1.AuthServices();
exports.SocketService = new services_1.SocketService();
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
