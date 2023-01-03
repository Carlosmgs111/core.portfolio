"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    uuid: {
        type: String,
        required: true,
        unique: true,
    },
    User: { type: String, ref: 'User' },
    title: {
        type: String,
        unique: true,
        required: true,
        lowercase: false,
        trim: false,
    },
    content: {
        type: String,
        unique: false,
        required: true,
        lowercase: true,
        trim: true,
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
exports.default = (0, mongoose_1.model)('Post', postSchema);
