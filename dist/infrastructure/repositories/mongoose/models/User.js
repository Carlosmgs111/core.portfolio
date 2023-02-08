"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    uuid: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        unique: true,
        required: true,
        lowercase: false,
        trim: false,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    privilege: {
        type: String,
        required: true,
    },
    avatar: { type: String },
    Certifications: [{ type: String, ref: "Certification" }],
    Institutions: [{ type: String, ref: "Institution" }],
    Projects: [{ type: String, ref: "Project" }],
    Skills: [{ type: String, ref: "Skill" }],
    createdAt: {
        type: Number,
        required: true,
        modifiable: false,
    },
    updatedAt: {
        type: Number,
        required: true,
    },
});
exports.default = (0, mongoose_1.model)("User", userSchema);
