"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users_Certifications = exports.user_certification_schema = exports.user_certification_table = void 0;
const sequelize_1 = require("sequelize");
const __1 = require("..");
exports.user_certification_table = "Users_Certifications";
exports.user_certification_schema = {
    uuid: {
        primaryKey: true,
        allowNull: false,
        unique: true,
        type: sequelize_1.DataTypes.STRING,
    },
    userUUID: {
        field: "user_uuid",
        unique: false,
        allowNull: false,
        type: sequelize_1.DataTypes.STRING,
        references: {
            model: "Users",
            key: "uuid",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION",
        },
    },
    certificationUUID: {
        field: "certification_uuid",
        unique: false,
        allowNull: false,
        type: sequelize_1.DataTypes.STRING,
        references: {
            model: "Certifications",
            key: "uuid",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION",
        },
    },
};
exports.Users_Certifications = __1.sequelize.define(exports.user_certification_table, exports.user_certification_schema, {
    createdAt: false,
    updatedAt: false,
});
