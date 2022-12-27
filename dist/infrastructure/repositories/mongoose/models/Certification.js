"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const certificationSchema = new mongoose_1.Schema({
    uuid: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        unique: true,
        required: true,
        lowercase: false,
        trim: false,
    },
    grantedTo: { type: mongoose_1.Schema.Types.String, ref: "User" },
    institutionUUID: {
        type: String,
        unique: false,
        required: true,
        lowercase: true,
        trim: true,
        ref: "Institution",
    },
    image: {
        type: String,
        required: true,
        unique: true,
    },
    url: {
        type: String,
        required: true,
        unique: true,
    },
    tags: { type: [String] },
    emitedAt: { type: Number },
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
exports.default = (0, mongoose_1.model)("Certification", certificationSchema);
