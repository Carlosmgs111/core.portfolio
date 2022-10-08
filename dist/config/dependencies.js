"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiConfig = exports.AuthServices = exports.DatabaseService = void 0;
const services_1 = require("../application/services");
exports.DatabaseService = (0, services_1.DatabaseService)( /* ServicesInterfaceEnums.DatabaseMongooseService */);
exports.AuthServices = new services_1.AuthServices();
const apiVersions = ["v1"];
exports.apiConfig = {
    versions: apiVersions,
    version: apiVersions[apiVersions.length - 1],
};
