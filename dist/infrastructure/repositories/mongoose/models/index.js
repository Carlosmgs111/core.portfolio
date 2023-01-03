"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Project_1 = __importDefault(require("./Project"));
const User_1 = __importDefault(require("./User"));
const Certification_1 = __importDefault(require("./Certification"));
const Institution_1 = __importDefault(require("./Institution"));
const Post_1 = __importDefault(require("./Post"));
const models = { Project: Project_1.default, User: User_1.default, Certification: Certification_1.default, Institution: Institution_1.default, Post: Post_1.default };
exports.default = models;
