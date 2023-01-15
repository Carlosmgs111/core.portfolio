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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const uuid_1 = require("uuid");
const utils_1 = require("../../utils");
const boom_1 = __importDefault(require("@hapi/boom"));
class Post {
    constructor({ uuid, title, content, createdAt, updatedAt, }) {
        this.createdAt = 0;
        this.updatedAt = 0;
        this.remove = (RepositoryService) => __awaiter(this, void 0, void 0, function* () {
            return yield RepositoryService.removeOne(RepositoryService.entities.Post, {
                credentials: { uuid: this.uuid },
            });
        });
        this.update = (RepositoryService, data) => __awaiter(this, void 0, void 0, function* () {
            this.updatedAt = new Date().getTime();
            return yield RepositoryService.update(RepositoryService.entities.Post, Object.assign({}, (0, utils_1.getEntityProperties)(Object.assign(Object.assign({}, this), data))), { credentials: { uuid: this.uuid } });
        });
        this.uuid = uuid;
        this.title = title;
        this.content = content;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.Post = Post;
_a = Post;
Post.create = (RepositoryService, data) => __awaiter(void 0, void 0, void 0, function* () {
    const exist = yield RepositoryService.findOne(RepositoryService.entities.Post, {
        credentials: (0, utils_1.filterAttrs)(data, ["token", "user"]),
    });
    console.log({ exist });
    if (exist)
        throw boom_1.default.conflict("Entity exist yet!");
    const uuid = (0, uuid_1.v4)();
    const post = yield RepositoryService.createOneRelationship2One(new Post(Object.assign(Object.assign({}, data), { uuid, createdAt: new Date().getTime(), updatedAt: new Date().getTime() })), [{ user: { uuid: data.user.uuid } }]);
    yield RepositoryService.create(Object.assign({}, (0, utils_1.getEntityProperties)(post)));
    return post;
});
Post.load = (RepositoryService, credentials) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield Post.find(RepositoryService, { uuid: credentials.uuid });
    if (!user)
        throw boom_1.default.notFound("Incorrect credentials!");
    const account = new Post(user);
    return account;
});
Post.find = (RepositoryService, credentials) => __awaiter(void 0, void 0, void 0, function* () {
    const account = yield RepositoryService.findOne(RepositoryService.entities.Post, {
        credentials: (0, utils_1.filterAttrs)((0, utils_1.getEntityProperties)(credentials), ["title", "userUUID"], false),
    });
    return account;
});
