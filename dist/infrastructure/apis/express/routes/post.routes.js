"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const posts_1 = require("../../../../application/use_cases/posts");
const express_2 = require("../../../../adapters/apis/express");
const router = (0, express_1.Router)();
router
    .post("/", (0, express_2.expressHandlerAdapter)(posts_1.addPost))
    .get("/", (0, express_2.expressHandlerAdapter)(posts_1.getAllPosts))
    .delete("/", (0, express_2.expressHandlerAdapter)(posts_1.removePost))
    .patch("/", (0, express_2.expressHandlerAdapter)(posts_1.updatePost));
exports.default = router;
