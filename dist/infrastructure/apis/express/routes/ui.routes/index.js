"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// ? Used for render views
const express_1 = require("express");
const certification_routes_1 = __importDefault(require("../../../../../modules/certifications/infrastructure/apis/express/routes/ui.routes/certification.routes"));
const router = (0, express_1.Router)();
router.use("/certifications", certification_routes_1.default);
exports.default = router;
