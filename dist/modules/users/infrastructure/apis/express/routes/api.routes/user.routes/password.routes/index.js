"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_2 = require("../../../../../../../../../adapters/apis/express");
const register_1 = require("../../../../../../../application/register");
const router = (0, express_1.Router)();
exports.default = router.patch("/reset", (0, express_2.expressHandlerAdapter)(register_1.resetPassword));
