"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("../../../config"));
exports.sequelize = new sequelize_1.Sequelize(config_1.default.postgresDatabase, config_1.default.postgresUser, config_1.default.postgresPassword, { host: "localhost", dialect: "postgres" });
