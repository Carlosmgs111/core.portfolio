"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = exports.project_schema = exports.project_table = void 0;
const sequelize_1 = require("sequelize");
const infrastructure_1 = require("../../../services/DatabaseServices/SequelizeAdapter/infrastructure");
exports.project_table = "Projects";
exports.project_schema = {
    uuid: {
        primaryKey: true,
        allowNull: false,
        unique: true,
        type: sequelize_1.DataTypes.STRING,
    },
    name: { allowNull: false, type: sequelize_1.DataTypes.STRING, unique: true },
    descriptions: { type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT), allowNull: true },
    images: { type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT), allowNull: true },
    tags: {
        allowNull: true,
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        default: [],
    },
    uri: { type: sequelize_1.DataTypes.STRING },
    version: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    createdAt: { type: sequelize_1.DataTypes.DATE, allowNull: false, field: "created_at" },
    updatedAt: { type: sequelize_1.DataTypes.DATE, allowNull: false, field: "updated_at" },
};
class Project extends sequelize_1.Model {
    static associate(models) {
        this.belongsToMany(models.User, {
            through: models.Users_Projects,
            foreignKey: "projectUUID",
            otherKey: "userUUID",
        });
    }
}
exports.Project = Project;
Project.init(exports.project_schema, { sequelize: infrastructure_1.sequelize, modelName: exports.project_table });
