"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const projectSchema = new mongoose_1.Schema({
    uuid: {
        type: String,
        required: true,
        unique: true,
    },
    Users: [{ type: String, ref: "User" }],
    name: {
        type: String,
        unique: true,
        required: true,
        lowercase: false,
        trim: false,
    },
    descriptions: {
        type: [String],
        required: true,
    },
    images: {
        type: [String],
        required: true,
    },
    tags: {
        type: [String],
        required: true,
    },
    uri: {
        type: String,
        required: true,
    },
    version: {
        type: String,
        required: true,
    },
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
exports.default = (0, mongoose_1.model)("Project", projectSchema);
