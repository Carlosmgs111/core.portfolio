"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = exports.post_schema = exports.post_table = void 0;
const sequelize_1 = require("sequelize");
const __1 = require("..");
exports.post_table = "Posts";
exports.post_schema = {
    uuid: {
        primaryKey: true,
        allowNull: false,
        unique: true,
        type: sequelize_1.DataTypes.STRING,
    },
    userUUID: {
        field: "user_uuid",
        unique: true,
        allowNull: false,
        type: sequelize_1.DataTypes.STRING,
        foreignKey: true
    },
    title: { allowNull: false, type: sequelize_1.DataTypes.STRING },
    content: { allowNull: false, type: sequelize_1.DataTypes.TEXT },
    createdAt: { type: sequelize_1.DataTypes.DATE, allowNull: false, field: "created_at" },
    updatedAt: { type: sequelize_1.DataTypes.DATE, allowNull: false, field: "updated_at" },
};
class Post extends sequelize_1.Model {
    static associate(models) { }
}
exports.Post = Post;
Post.init(exports.post_schema, { sequelize: __1.sequelize, tableName: exports.post_table });
