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
exports.signup = exports.login = void 0;
const entity_1 = require("../users/entity");
const aggregates_1 = require("./aggregates");
const dependencies_1 = require("../../config/dependencies");
const dependencies_2 = require("../../config/dependencies");
const utils_1 = require("../../utils");
const login = (credentials) => __awaiter(void 0, void 0, void 0, function* () {
    const account = yield aggregates_1.Auth.authenticate(dependencies_1.RepositoryService, {
        credentials,
        // related: [["Institution"], ["Certification"]],
    });
    if (!account)
        throw new Error("The account doesn't exist!");
    let response = dependencies_2.AuthServices.getAuthPackage((0, utils_1.filterAttrs)(account, ["uuid", "email", "username", "privilege", "createdAt", "avatar"], false));
    return response;
});
exports.login = login;
const signup = (credentials) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = credentials;
    if (email)
        console.log("Authenticated Signup use case must be implemented! ".bgYellow);
    return yield entity_1.User.create(dependencies_1.RepositoryService, credentials);
});
exports.signup = signup;
