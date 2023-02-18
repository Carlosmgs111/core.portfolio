"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const register_1 = require("../../../../../application/register");
const user_schema_1 = require("../../../../../../infrastructure/schemas/user.schema");
const validator_handler_1 = require("../../../../../../infrastructure/apis/express/middlewares/validator.handler");
const express_2 = require("../../../../../../adapters/apis/express");
const router = (0, express_1.Router)();
exports.default = router
    .post("/signup", (0, validator_handler_1.validatorHandler)(user_schema_1.createUserSchema, "body"), (0, express_2.expressHandlerAdapter)(register_1.signup))
    .get("/signin", (0, validator_handler_1.validatorHandler)(user_schema_1.getUserSchema, "body"), (0, express_2.expressHandlerAdapter)(register_1.signin))
    .post("/signin", (0, validator_handler_1.validatorHandler)(user_schema_1.getUserSchema, "body"), (0, express_2.expressHandlerAdapter)(register_1.signin));
