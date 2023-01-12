"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CQRS_1 = require("../../../../../application/use_cases/CQRS");
const express_2 = require("../../../../../adapters/apis/express");
const router = (0, express_1.Router)();
exports.default = router.get("/sync", (0, express_2.expressHandlerAdapter)(CQRS_1.sync));
