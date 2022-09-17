import { Model, DataTypes } from "sequelize";
import { sequelize } from "..";

export const project_table = "Projects";
export const project_schema = {
  uuid: {
    primaryKey: true,
    allowNull: false,
    unique: true,
    type: DataTypes.STRING,
  },
  user_uuid: {
    unique: true,
    allowNull: false,
    type: DataTypes.STRING,
    references: {
      model: "Users",
      key: "uuid",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION",
    },
  },
  name: { allowNull: false, type: DataTypes.STRING, unique:true },
  description: { allowNull: false, type: DataTypes.TEXT },
  uri: { type: DataTypes.STRING },
  version: { type: DataTypes.STRING, allowNull: false },
  createdAt: { type: DataTypes.DATE, allowNull: false, as: "created_at" },
  updatedAt: { type: DataTypes.DATE, allowNull: false, as: "updated_at" },
};

export const Project = sequelize.define(project_table, project_schema);
