"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const project_routes_1 = __importDefault(require("../../../../../modules/projects/insfrastructure/apis/express/routes/api.routes/project.routes"));
const user_routes_1 = __importDefault(require("../../../../../modules/users/infrastructure/apis/express/routes/api.routes/user.routes"));
const certification_routes_1 = __importDefault(require("../../../../../modules/certifications/infrastructure/apis/express/routes/api.routes/certification.routes"));
const institution_routes_1 = __importDefault(require("../../../../../modules/institutions/infrastructure/apis/express/routes/api.routes//institution.routes"));
const auth_routes_1 = __importDefault(require("../../../../../modules/users/infrastructure/apis/express/routes/api.routes/auth.routes"));
const post_routes_1 = __importDefault(require("../../../../../modules/posts/insfrasctructure/apis/express/routes/api.routes/post.routes"));
const skill_routes_1 = __importDefault(require("../../../../../modules/skills/infrastructure/apis/express/routes/api.routes/skill.routes"));
const note_routes_1 = __importDefault(require("../../../../../modules/notes/insfrastructure/apis/express/routes/api.routes/note.routes"));
const router = (0, express_1.Router)();
exports.default = router
    .use("/projects", project_routes_1.default)
    .use("/users", user_routes_1.default)
    .use("/certifications", certification_routes_1.default)
    .use("/institutions", institution_routes_1.default)
    .use("/posts", post_routes_1.default)
    .use("/skills", skill_routes_1.default)
    .use("/notes", note_routes_1.default)
    .use("", auth_routes_1.default);
