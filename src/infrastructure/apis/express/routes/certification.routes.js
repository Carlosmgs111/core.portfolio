"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const certifications_1 = require("../../../../application/use_cases/certifications");
const express_2 = require("../../../../adapters/apis/express");
const router = (0, express_1.Router)();
router.post("/add", (0, express_2.expressHandlerAdapter)(certifications_1.addNewCertification));
router.get("/certifications", (0, express_2.expressHandlerAdapter)(certifications_1.getCertifications));
exports.default = router;
