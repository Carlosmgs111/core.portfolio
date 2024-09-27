"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dependencies_1 = require("../../../config/dependencies");
const __1 = require("../");
const { controllerAdapter } = dependencies_1.RESTAPIService;
exports.default = dependencies_1.RESTAPIService.addPath("", (router) => {
    router
        .post("/generate", controllerAdapter(__1.generateImages))
        .get("/availablesettings", controllerAdapter(__1.availabelSettings))
        .post("/modifyimages", controllerAdapter(__1.modifyImages));
});
