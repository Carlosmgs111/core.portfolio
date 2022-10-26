import { Model, DataTypes } from "sequelize";
import { sequelize } from "..";

export const skill_table = "Skills";
export const skill_schema = {
  uuid: {
    primaryKey: true,
    allowNull: false,
    unique: true,
    type: DataTypes.STRING,
  },
  userUUID: {
    field: "user_uuid",
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
  name: { allowNull: false, type: DataTypes.STRING, unique: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  image: { type: DataTypes.STRING, allowNull: true },
  tags: { allowNull: true, type: DataTypes.ARRAY(DataTypes.STRING) },
  createdAt: { type: DataTypes.DATE, allowNull: false, field: "created_at" },
  updatedAt: { type: DataTypes.DATE, allowNull: false, field: "updated_at" },
};

export class Skill extends Model {
  static associate(models: any) {}
}

Skill.init(skill_schema, { sequelize, modelName: skill_table });
