"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.user_table = void 0;
const sequelize_1 = require("sequelize");
const __1 = require("..");
exports.user_table = "User";
exports.User = __1.sequelize.define(exports.user_table, {
    uuid: sequelize_1.DataTypes.STRING,
    username: sequelize_1.DataTypes.STRING,
    email: sequelize_1.DataTypes.STRING,
    password: sequelize_1.DataTypes.STRING,
    privilege: sequelize_1.DataTypes.STRING,
    createdAt: sequelize_1.DataTypes.DATEONLY,
    updatedAt: sequelize_1.DataTypes.DATEONLY,
    role: sequelize_1.DataTypes.STRING
});
