"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dependencies_1 = require("../../../../config/dependencies");
const use_cases_1 = require("../use_cases");
// import { validatorHandler } from "../../../../infrastructure/apis/express/middlewares/validator.handler";
const { controllerAdapter } = dependencies_1.RESTAPIService;
exports.default = dependencies_1.RESTAPIService.addPath("", (router) => {
    router
        .post("/signup", 
    // validatorHandler(createUserSchema, "body"),
    controllerAdapter(use_cases_1.signup))
        .get("/signin", 
    // validatorHandler(getUserSchema, "body"),
    controllerAdapter(use_cases_1.login))
        .post("/signin", 
    // validatorHandler(getUserSchema, "body"),
    controllerAdapter(use_cases_1.login))
        .get("/logout", controllerAdapter(use_cases_1.logout))
        .get("/checkifisonline", controllerAdapter(use_cases_1.checkIfIsOnline));
});
