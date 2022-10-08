"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const certifications_1 = require("../../../../application/use_cases/certifications");
const express_2 = require("../../../../adapters/apis/express");
const router = (0, express_1.Router)();
router
    .post("/", (0, express_2.expressHandlerAdapter)(certifications_1.addNewCertification))
    .post("/certifications", (0, express_2.expressHandlerAdapter)(certifications_1.addManyCertifications))
    .get("/", (0, express_2.expressHandlerAdapter)(certifications_1.getCertifications))
    .delete("/", (0, express_2.expressHandlerAdapter)(certifications_1.removeCertification))
    .patch("/", (0, express_2.expressHandlerAdapter)(certifications_1.updateCertification));
exports.default = router;
