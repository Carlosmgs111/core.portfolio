"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const notes_1 = require("../../../../../application/notes");
const express_2 = require("../../../../../../adapters/apis/express");
exports.default = router
    .get("/mynotes", (0, express_2.expressHandlerAdapter)(notes_1.getMyNotes))
    .post("/", (0, express_2.expressHandlerAdapter)(notes_1.createNewNote));
