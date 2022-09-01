"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const projects_1 = require("../../../../application/use_cases/projects");
const express_2 = require("../../../../adapters/apis/express");
const router = (0, express_1.Router)();
router.get("/projects", (0, express_2.expressHandlerAdapter)(projects_1.getAllProjects));
router.post("/add", (0, express_2.expressHandlerAdapter)(projects_1.addProject));
exports.default = router;
