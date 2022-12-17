"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users_Institutions = exports.user_institution_schema = exports.user_institution_table = void 0;
const sequelize_1 = require("sequelize");
const __1 = require("..");
exports.user_institution_table = "Users_Institutions";
exports.user_institution_schema = {
    uuid: {
        primaryKey: true,
        allowNull: false,
        unique: true,
        type: sequelize_1.DataTypes.STRING,
    },
    userUUID: {
        unique: false,
        allowNull: false,
        field: "user_uuid",
        type: sequelize_1.DataTypes.STRING,
        references: {
            model: "Users",
            key: "uuid",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION",
        },
    },
    institutionUUID: {
        unique: false,
        allowNull: false,
        field: "institution_uuid",
        type: sequelize_1.DataTypes.STRING,
        references: {
            model: "Institutions",
            key: "uuid",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION",
        },
    },
};
exports.Users_Institutions = __1.sequelize.define(exports.user_institution_table, exports.user_institution_schema, { createdAt: false, updatedAt: false });
