"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const skills_1 = require("../../../../../application/skills");
const express_2 = require("../../../../../../adapters/apis/express");
const router = (0, express_1.Router)();
exports.default = router
    .get("/", (0, express_2.expressHandlerAdapter)(skills_1.getAllSkills))
    .post("/", (0, express_2.expressHandlerAdapter)(skills_1.addNewSkill))
    .post("/skills", (0, express_2.expressHandlerAdapter)(skills_1.addManySkills))
    .delete("/", (0, express_2.expressHandlerAdapter)(skills_1.deleteSkill))
    .patch("/", (0, express_2.expressHandlerAdapter)(skills_1.updateSkill))
    .patch("/:uuid", (0, express_2.expressHandlerAdapter)(skills_1.updateSkill));
