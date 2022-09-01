"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const institutions_1 = require("../../../../application/use_cases/institutions");
const express_2 = require("../../../../adapters/apis/express");
const router = (0, express_1.Router)();
router.post("/add", (0, express_2.expressHandlerAdapter)(institutions_1.addNewInstitution));
exports.default = router;
