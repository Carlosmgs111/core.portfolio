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
exports.updatePost = exports.removePost = exports.getAllPosts = exports.addPost = void 0;
const entity_1 = require("./entity");
const dependencies_1 = require("../../config/dependencies");
const addPost = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield entity_1.Post.create(dependencies_1.RepositoryService, data);
});
exports.addPost = addPost;
const getAllPosts = (data) => __awaiter(void 0, void 0, void 0, function* () { return yield dependencies_1.RepositoryService.findAll(dependencies_1.RepositoryService.entities.Post); });
exports.getAllPosts = getAllPosts;
const removePost = (data) => __awaiter(void 0, void 0, void 0, function* () { return yield (yield entity_1.Post.load(dependencies_1.RepositoryService, data)).remove(dependencies_1.RepositoryService); });
exports.removePost = removePost;
const updatePost = (data) => __awaiter(void 0, void 0, void 0, function* () { return (yield entity_1.Post.load(dependencies_1.RepositoryService, data)).update(dependencies_1.RepositoryService, data); });
exports.updatePost = updatePost;
