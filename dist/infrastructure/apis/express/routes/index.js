"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dependencies_1 = require("../../../../config/dependencies");
const express_1 = require("express");
const api_routes_1 = __importDefault(require("./api.routes"));
const router = (0, express_1.Router)();
router.use(`/api/${dependencies_1.apiConfig.version}`, api_routes_1.default);
exports.default = router;
