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
exports.createOne = exports.findBy = void 0;
const User_1 = require("../../domain/entities/User");
const dependencies_1 = require("../../config/dependencies");
const entities = { User: User_1.User };
const findBy = (label, findBy) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log({ findBy });
    return yield entities[label].find(dependencies_1.RepositoryService, { credentials: findBy });
});
exports.findBy = findBy;
const createOne = (label, args) => __awaiter(void 0, void 0, void 0, function* () {
    return yield entities[label].new(dependencies_1.RepositoryService, args);
});
exports.createOne = createOne;
