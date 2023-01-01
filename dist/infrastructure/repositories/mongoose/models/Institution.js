"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const institutionSchema = new mongoose_1.Schema({
    uuid: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        unique: true,
        required: true,
        lowercase: false,
        trim: false,
    },
    businessName: {
        type: String,
        unique: false,
        required: true,
        lowercase: true,
        trim: true,
    },
    Users: [{ type: String, ref: "User" }],
    descriptions: {
        type: [String],
        unique: false,
        required: true,
        lowercase: true,
        trim: true,
        default: [],
    },
    urls: {
        type: [String],
        required: false,
        unique: false,
        default: [],
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
exports.default = (0, mongoose_1.model)("Institution", institutionSchema);
