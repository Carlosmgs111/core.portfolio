"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const __1 = require("../");
const express_2 = require("../../../adapters/apis/express");
const router = (0, express_1.Router)();
exports.default = router.post("/generate", (0, express_2.expressHandlerAdapter)(__1.generateImage));
