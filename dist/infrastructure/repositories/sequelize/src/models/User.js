"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.user_schema = exports.user_table = void 0;
const sequelize_1 = require("sequelize");
const __1 = require("..");
exports.user_table = "Users";
exports.user_schema = {
    uuid: {
        primaryKey: true,
        allowNull: false,
        unique: true,
        type: sequelize_1.DataTypes.STRING,
    },
    username: {
        unique: true,
        allowNull: false,
        type: sequelize_1.DataTypes.STRING,
    },
    email: { allowNull: true, unique: true, type: sequelize_1.DataTypes.STRING },
    password: { allowNull: false, type: sequelize_1.DataTypes.STRING },
    privilege: { type: sequelize_1.DataTypes.ENUM, values: ["user", "admin"] },
    avatar: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        field: "created_at",
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        field: "updated_at",
    },
};
// export const User = sequelize.define(user_table, user_schema);
class User extends sequelize_1.Model {
    static associate(models) {
        // ? N2N relationships
        this.belongsToMany(models.Certification, {
            through: models.Users_Certifications,
            foreignKey: "userUUID",
            otherKey: "certificationUUID",
        });
        this.belongsToMany(models.Institution, {
            through: models.Users_Institutions,
            foreignKey: "userUUID",
            otherKey: "institutionUUID",
        });
        this.belongsToMany(models.Skill, {
            through: models.Users_Skills,
            foreignKey: "userUUID",
            otherKey: "skillUUID",
        });
        this.belongsToMany(models.Project, {
            through: models.Users_Projects,
            foreignKey: "userUUID",
            otherKey: "projectUUID",
        });
        // ? One2N relationships
        this.hasMany(models.Post, {
            as: "Posts",
            foreignKey: "userUUID",
        });
    }
}
exports.User = User;
User.init(exports.user_schema, { sequelize: __1.sequelize, modelName: exports.user_table });
