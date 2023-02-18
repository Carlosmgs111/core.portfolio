"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const certifications_1 = require("../../../../application/certifications");
const express_2 = require("../../../../../adapters/apis/express");
const validator_handler_1 = require("../../../../../infrastructure/apis/express/middlewares/validator.handler");
const certification_schema_1 = require("../../../../../infrastructure/schemas/certification.schema");
const router = (0, express_1.Router)();
exports.default = router
    .post("/", (0, validator_handler_1.validatorHandler)(certification_schema_1.createCertification, "body"), (0, express_2.expressHandlerAdapter)(certifications_1.addNewCertification))
    .post("/certifications", 
// validatorHandler(createCertifications, "body"),
(0, express_2.expressHandlerAdapter)(certifications_1.addManyCertifications))
    .get("/", (0, express_2.expressHandlerAdapter)(certifications_1.getCertifications))
    .get("/hello", (req, res) => {
    console.log("hello");
    res.send("Hello");
})
    .get("/:username", (0, express_2.expressHandlerAdapter)(certifications_1.getCertifications))
    .delete("/", (0, express_2.expressHandlerAdapter)(certifications_1.removeCertification))
    .delete("/:uuid", (0, express_2.expressHandlerAdapter)(certifications_1.removeCertification))
    .patch("/", (0, validator_handler_1.validatorHandler)(certification_schema_1.updateCertification, "body"), (0, express_2.expressHandlerAdapter)(certifications_1.updateCertification));
