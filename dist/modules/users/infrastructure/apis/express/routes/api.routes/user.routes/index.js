"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const password_routes_1 = __importDefault(require("./password.routes"));
const users_1 = require("../../../../../../application/users");
const user_schema_1 = require("../../../../../../../../infrastructure/schemas/user.schema");
const validator_handler_1 = require("../../../../../../../../infrastructure/apis/express/middlewares/validator.handler");
const express_2 = require("../../../../../../../../adapters/apis/express");
const router = (0, express_1.Router)();
exports.default = router
    .get("/", (0, validator_handler_1.validatorHandler)(user_schema_1.getUserSchema, "body"), (0, express_2.expressHandlerAdapter)(users_1.signin))
    .get("/sayhello", (0, express_2.expressHandlerAdapter)(users_1.sayHello))
    .get("/:email", (0, validator_handler_1.validatorHandler)(user_schema_1.getUserSchema, "params"), (0, express_2.expressHandlerAdapter)(users_1.signin))
    .post("/", (0, validator_handler_1.validatorHandler)(user_schema_1.createUserSchema, "body"), (0, express_2.expressHandlerAdapter)(users_1.registerUser))
    .patch("/", (0, validator_handler_1.validatorHandler)(user_schema_1.updateUserSchema, "body"), (0, express_2.expressHandlerAdapter)(users_1.updateUser))
    .delete("/", (0, validator_handler_1.validatorHandler)(user_schema_1.getUserSchema, "body"), (0, express_2.expressHandlerAdapter)(users_1.removeUser))
    .patch("/username/change", (0, express_2.expressHandlerAdapter)(users_1.changeUsername))
    .get("/username/all", (0, express_2.expressHandlerAdapter)(users_1.getAllUsername))
    .patch("/avatar/update", (0, express_2.expressHandlerAdapter)(users_1.updateAvatar))
    .use("/password", password_routes_1.default);
