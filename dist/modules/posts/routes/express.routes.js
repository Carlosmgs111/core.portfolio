"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const use_cases_1 = require("../use_cases");
const express_2 = require("../../../adapters/apis/express");
const router = (0, express_1.Router)();
exports.default = router
    .post("/", (0, express_2.expressHandlerAdapter)(use_cases_1.addPost))
    .get("/", (0, express_2.expressHandlerAdapter)(use_cases_1.getAllPosts))
    .delete("/", (0, express_2.expressHandlerAdapter)(use_cases_1.removePost))
    .patch("/", (0, express_2.expressHandlerAdapter)(use_cases_1.updatePost));
