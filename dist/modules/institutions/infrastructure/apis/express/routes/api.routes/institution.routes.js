"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const institutions_1 = require("../../../../../application/institutions");
const express_2 = require("../../../../../../../adapters/apis/express");
const router = (0, express_1.Router)();
exports.default = router
    .post("/", (0, express_2.expressHandlerAdapter)(institutions_1.addNewInstitution))
    .get("/", (0, express_2.expressHandlerAdapter)(institutions_1.getAllInstitutions))
    .patch("/", (0, express_2.expressHandlerAdapter)(institutions_1.updateInstitution))
    .delete("/", (0, express_2.expressHandlerAdapter)(institutions_1.deleteInstitution));
