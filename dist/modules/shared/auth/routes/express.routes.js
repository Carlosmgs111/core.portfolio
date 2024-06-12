"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const use_cases_1 = require("../use_cases");
const user_schema_1 = require("../../../../infrastructure/schemas/user.schema");
const validator_handler_1 = require("../../../../infrastructure/apis/express/middlewares/validator.handler");
const express_2 = require("../../../../adapters/apis/express");
const router = (0, express_1.Router)();
exports.default = router
    .post("/signup", (0, validator_handler_1.validatorHandler)(user_schema_1.createUserSchema, "body"), (0, express_2.expressHandlerAdapter)(use_cases_1.signup))
    .get("/signin", (0, validator_handler_1.validatorHandler)(user_schema_1.getUserSchema, "body"), (0, express_2.expressHandlerAdapter)(use_cases_1.login))
    .post("/signin", (0, validator_handler_1.validatorHandler)(user_schema_1.getUserSchema, "body"), (0, express_2.expressHandlerAdapter)(use_cases_1.login))
    .get("/logout", (0, express_2.expressHandlerAdapter)(use_cases_1.logout))
    .get("/checkifisonline", (0, express_2.expressHandlerAdapter)(use_cases_1.checkIfIsOnline));
