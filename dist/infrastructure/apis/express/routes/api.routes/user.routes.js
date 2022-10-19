"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_1 = require("../../../../../application/use_cases/users");
const user_schema_1 = require("../../../../schemas/user.schema");
const validator_handler_1 = require("../../middlewares/validator.handler");
const express_2 = require("../../../../../adapters/apis/express");
const router = (0, express_1.Router)();
exports.default = router
    .get("/", (0, validator_handler_1.validatorHandler)(user_schema_1.getUserSchema, "body"), (0, express_2.expressHandlerAdapter)(users_1.signin))
    .get("/sayhello", (0, express_2.expressHandlerAdapter)(users_1.sayHello))
    .get("/:email", (0, validator_handler_1.validatorHandler)(user_schema_1.getUserSchema, "params"), (0, express_2.expressHandlerAdapter)(users_1.signin))
    .post("/", (0, validator_handler_1.validatorHandler)(user_schema_1.createUserSchema, "body"), (0, express_2.expressHandlerAdapter)(users_1.registerUser))
    .patch("/", (0, validator_handler_1.validatorHandler)(user_schema_1.updateUserSchema, "body"), (0, express_2.expressHandlerAdapter)(users_1.updateUser))
    .delete("/", (0, validator_handler_1.validatorHandler)(user_schema_1.getUserSchema, "body"), (0, express_2.expressHandlerAdapter)(users_1.removeUser));
