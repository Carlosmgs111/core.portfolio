"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_1 = require("../../../../application/use_cases/users");
const express_2 = require("../../../../adapters/apis/express");
const router = (0, express_1.Router)();
router
    .post("/signup", (0, express_2.expressHandlerAdapter)(users_1.registerUser))
    .post("/signin", (0, express_2.expressHandlerAdapter)(users_1.signin))
    .post("/remove", (0, express_2.expressHandlerAdapter)(users_1.removeUser))
    .post("/update", (0, express_2.expressHandlerAdapter)(users_1.updateUser));
exports.default = router;
