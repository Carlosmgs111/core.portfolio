"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Skill = exports.skill_schema = exports.skill_table = void 0;
const sequelize_1 = require("sequelize");
const src_1 = require("../../../../infrastructure/repositories/sequelize/src");
exports.skill_table = "Skills";
exports.skill_schema = {
    uuid: {
        primaryKey: true,
        allowNull: false,
        unique: true,
        type: sequelize_1.DataTypes.STRING,
    },
    name: { allowNull: false, type: sequelize_1.DataTypes.STRING, unique: false },
    description: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
    image: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    tags: { allowNull: true, type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING) },
    createdAt: { type: sequelize_1.DataTypes.DATE, allowNull: false, field: "created_at" },
    updatedAt: { type: sequelize_1.DataTypes.DATE, allowNull: false, field: "updated_at" },
};
class Skill extends sequelize_1.Model {
    static associate(models) {
        this.belongsToMany(models.User, {
            through: models.Users_Skills,
            foreignKey: "skillUUID",
            otherKey: "userUUID",
        });
    }
}
exports.Skill = Skill;
Skill.init(exports.skill_schema, { sequelize: src_1.sequelize, modelName: exports.skill_table });
