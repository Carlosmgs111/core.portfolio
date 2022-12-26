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
    Certifications: [{ type: mongoose_1.Schema.Types.String, ref: "Certification" }],
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
