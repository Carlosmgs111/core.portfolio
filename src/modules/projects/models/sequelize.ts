import { Model, DataTypes } from "sequelize";
import { sequelize } from "../../../services/DatabaseServices/SequelizeAdapter/infrastructure";

export const project_table = "Projects";
export const project_schema = {
  uuid: {
    primaryKey: true,
    allowNull: false,
    unique: true,
    type: DataTypes.STRING,
  },
  name: { allowNull: false, type: DataTypes.STRING, unique: true },
  descriptions: { type: DataTypes.ARRAY(DataTypes.TEXT), allowNull: true },
  images: { type: DataTypes.ARRAY(DataTypes.TEXT), allowNull: true },
  tags: {
    allowNull: true,
    type: DataTypes.ARRAY(DataTypes.STRING),
    default: [],
  },
  state: {
    allowNull: false,
    type: DataTypes.STRING,
    default: "",
  },
  stack: {
    allowNull: false,
    type: DataTypes.ARRAY(DataTypes.STRING),
    default: [],
  },
  kind: {
    allowNull: false,
    type: DataTypes.ARRAY(DataTypes.STRING),
    default: [],
  },
  uri: { type: DataTypes.STRING },
  version: { type: DataTypes.STRING, allowNull: false },
  createdAt: { type: DataTypes.DATE, allowNull: false, field: "created_at" },
  updatedAt: { type: DataTypes.DATE, allowNull: false, field: "updated_at" },
};

export class Project extends Model {
  static associate(models: any) {
    this.belongsToMany(models.User, {
      through: models.Users_Projects,
      foreignKey: "projectUUID",
      otherKey: "userUUID",
    });
  }
}

Project.init(project_schema, { sequelize, modelName: project_table });
