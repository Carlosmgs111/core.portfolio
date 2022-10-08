"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./infrastructure/apis/express/index"));
const dependencies_1 = require("./config/dependencies");
require("./infrastructure/repositories/mongoose");
dependencies_1.DatabaseService.info();
(0, index_1.default)();
