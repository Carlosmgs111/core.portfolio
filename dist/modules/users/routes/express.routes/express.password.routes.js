"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_2 = require("../../../../adapters/apis/express");
const use_cases_1 = require("../../use_cases");
const router = (0, express_1.Router)();
exports.default = router.patch("/reset", (0, express_2.expressHandlerAdapter)(use_cases_1.resetPassword));
