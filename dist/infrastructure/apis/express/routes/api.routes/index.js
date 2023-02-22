"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_routes_1 = __importDefault(require("../../../../../modules/projects/routes/express.routes"));
const express_routes_2 = __importDefault(require("../../../../../modules/users/routes/express.routes"));
const express_api_routes_1 = __importDefault(require("../../../../../modules/certifications/routes/express.api.routes"));
const express_routes_3 = __importDefault(require("../../../../../modules/institutions/routes/express.routes"));
const express_routes_4 = __importDefault(require("../../../../../modules/shared/auth/routes/express.routes"));
const express_routes_5 = __importDefault(require("../../../../../modules/posts/routes/express.routes"));
const express_routes_6 = __importDefault(require("../../../../../modules/skills/routes/express.routes"));
const express_routes_7 = __importDefault(require("../../../../../modules/notes/routes/express.routes"));
const router = (0, express_1.Router)();
exports.default = router
    .use("/projects", express_routes_1.default)
    .use("/users", express_routes_2.default)
    .use("/certifications", express_api_routes_1.default)
    .use("/institutions", express_routes_3.default)
    .use("/posts", express_routes_5.default)
    .use("/skills", express_routes_6.default)
    .use("/notes", express_routes_7.default)
    .use("", express_routes_4.default);
