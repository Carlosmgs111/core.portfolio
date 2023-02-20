"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const use_cases_1 = require("../use_cases");
const express_2 = require("../../../adapters/apis/express");
const router = (0, express_1.Router)();
exports.default = router
    .get("/", (0, express_2.expressHandlerAdapter)(use_cases_1.getProjects))
    .post("/", (0, express_2.expressHandlerAdapter)(use_cases_1.addProject))
    .post("/projects", (0, express_2.expressHandlerAdapter)(use_cases_1.addManyProject))
    .delete("/", (0, express_2.expressHandlerAdapter)(use_cases_1.deleteProject))
    .delete("/:uuid", (0, express_2.expressHandlerAdapter)(use_cases_1.deleteProject))
    .patch("/", (0, express_2.expressHandlerAdapter)(use_cases_1.updateProject))
    .patch("/:uuid", (0, express_2.expressHandlerAdapter)(use_cases_1.updateProject))
    // ! this fucntion should not be exposed by an API controller, and if it, should be protected by a middleware of authorization
    .get("/migrate_descriptions", (0, express_2.expressHandlerAdapter)(use_cases_1.migrateDescriptionToDescriptions))
    .get("/migrateRelationship2OneToN2N", (0, express_2.expressHandlerAdapter)(use_cases_1.migrateRelationship2OneToN2N));
