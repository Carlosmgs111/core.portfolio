"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uiConfig = exports.apiConfig = exports.RESTAPIService = exports.ChatService = exports.MailerService = exports.SocketService = exports.AuthServices = exports.RepositoryService = exports.TaskMessageService = void 0;
const index_1 = __importDefault(require("./index"));
const DatabaseServices_1 = require("../services/DatabaseServices");
const services_1 = require("../services");
const repositoryServices = {
    CQRS: () => new services_1.CQRSService(),
    DBS: () => (0, services_1.DatabaseService)(DatabaseServices_1.Adapters.SequelizeAdapter),
};
exports.TaskMessageService = new services_1.TaskMessageService();
exports.RepositoryService = repositoryServices.CQRS();
exports.AuthServices = new services_1.AuthServices();
exports.SocketService = new services_1.SocketService();
exports.MailerService = new services_1.MailerService();
exports.ChatService = new services_1.ChatService();
exports.RESTAPIService = new services_1.RESTAPIService();
const imageService = index_1.default.imageServiceUrlDev || index_1.default.imageServiceUrlProd;
exports.SocketService.addClient({
    imageService,
    path: index_1.default.websocketPath,
}); /* // ! ⬅️ Disabled in production until the service is online */
// SocketService.addClient({ remoteImageService: config.imageServiceUrlProd });
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
