"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const use_cases_1 = require("../use_cases");
const express_2 = require("../../../adapters/apis/express");
const router = (0, express_1.Router)();
exports.default = router
    .get("/", (0, express_2.expressHandlerAdapter)(use_cases_1.getAllSkills))
    .post("/", (0, express_2.expressHandlerAdapter)(use_cases_1.addNewSkill))
    .post("/skills", (0, express_2.expressHandlerAdapter)(use_cases_1.addManySkills))
    .delete("/", (0, express_2.expressHandlerAdapter)(use_cases_1.deleteSkill))
    .patch("/", (0, express_2.expressHandlerAdapter)(use_cases_1.updateSkill))
    .patch("/:uuid", (0, express_2.expressHandlerAdapter)(use_cases_1.updateSkill));
