"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("../../../../modules/projects/models/mongoose"));
const mongoose_2 = __importDefault(require("../../../../modules/users/models/mongoose"));
const mongoose_3 = __importDefault(require("../../../../modules/certifications/models/mongoose"));
const mongoose_4 = __importDefault(require("../../../../modules/institutions/models/mongoose"));
const mongoose_5 = __importDefault(require("../../../../modules/posts/models/mongoose"));
const mongoose_6 = __importDefault(require("../../../../modules/skills/models/mongoose"));
const mongoose_7 = __importDefault(require("../../../../modules/notes/models/mongoose"));
const models = {
    Project: mongoose_1.default,
    User: mongoose_2.default,
    Certification: mongoose_3.default,
    Institution: mongoose_4.default,
    Post: mongoose_5.default,
    Skill: mongoose_6.default,
    Note: mongoose_7.default,
};
exports.default = models;
