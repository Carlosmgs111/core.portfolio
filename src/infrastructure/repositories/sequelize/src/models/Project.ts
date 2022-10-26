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
  userUUID: {
    field:"user_uuid",
    unique: false,
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
  descriptions:{ type: DataTypes.ARRAY(DataTypes.TEXT), allowNull:true},
  images:{ type: DataTypes.ARRAY(DataTypes.TEXT), allowNull:true},
  tags: {allowNull:true, type: DataTypes.ARRAY(DataTypes.STRING)},
  uri: { type: DataTypes.STRING },
  version: { type: DataTypes.STRING, allowNull: false },
  createdAt: { type: DataTypes.DATE, allowNull: false, field: "created_at" },
  updatedAt: { type: DataTypes.DATE, allowNull: false, field: "updated_at" },
};

export class Project extends Model{
  static associate(models: any){
  }
}

Project.init(project_schema,{sequelize, modelName: project_table})