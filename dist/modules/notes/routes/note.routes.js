"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const use_case_1 = require("../use_case");
const express_2 = require("../../../adapters/apis/express");
exports.default = router
    .get("/mynotes", (0, express_2.expressHandlerAdapter)(use_case_1.getMyNotes))
    .post("/", (0, express_2.expressHandlerAdapter)(use_case_1.createNewNote));
